import React, {
  useState, useEffect, useCallback,
} from 'react';
import { Input, Button } from 'reactstrap';
import { debounce } from 'lodash';
import '../../css/components/bloglist.css';
import BlogCard from './BlogCard';
import Blog from '../../types/Blog';
import { BrowseTab } from '../../views/Browse';

type BlogListProps = {
  activeTab: BrowseTab;
};

export default function BlogList({ activeTab }: BlogListProps): JSX.Element {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [keyword, setKeyword] = useState('');

  // update blogs by activeTab
  useEffect(() => {
    setKeyword('');

    // TODO: 실제 데이터 사용
    setBlogs(activeTab === 'MINE'
      ? [
        {
          title: '내가 만든 블로그',
          description: '내가 만든 블로그에 대한 설명이다.',
          blogId: '1',
        },
        {
          title: '요리가 좋아요',
          description: '요리를 사랑한다면?',
          blogId: '2',
        },
        {
          title: '엔비디아는 신인가요?',
          description: '황회장님에 대한 믿음으로 가득한 곳.',
          blogId: '3',
        },
      ]
      : [
        {
          title: '남이 만든 블로그',
          description: '남이 만든 블로그에 대한 설명이다.',
          blogId: '11',
          user: { userId: '111', nickname: 'abc' },
        },
        {
          title: '요리가 싫어요',
          description: '요리를 증오한다면?',
          blogId: '22',
          user: { userId: '222', nickname: 'bindy' },
        },
        {
          title: '절세미녀',
          description: '도대체...',
          blogId: '33',
          user: { userId: '333', nickname: 'lselse' },
        },
      ]);
  }, [activeTab]);

  const throttledSetFilteredBlogs = useCallback(debounce((newKeyword: string) => {
    setFilteredBlogs(
      newKeyword
        ? blogs.filter(
          (blog) => blog.title.includes(newKeyword) || blog.description.includes(newKeyword) || blog.user?.nickname.includes(newKeyword),
        )
        : blogs,
    );
  }, 200), [blogs]);

  // filter blogs by keyword
  useEffect(() => {
    if (keyword) {
      throttledSetFilteredBlogs(keyword);
    } else {
      throttledSetFilteredBlogs.cancel();
      setFilteredBlogs(blogs);
    }
  }, [keyword, throttledSetFilteredBlogs]);

  return (
    <section className="blog_list">
      <header>
        <Input
          type="search"
          bsSize="sm"
          placeholder={`search a blog (title, description${activeTab === 'MINE' ? '' : ', user'})`}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        {activeTab === 'MINE' && <Button size="sm" color="primary">CREATE</Button>}
      </header>
      {filteredBlogs.map((blog) => (
        <BlogCard
          key={blog.blogId}
          title={blog.title}
          description={blog.description}
          blogId={blog.blogId}
          user={blog.user}
        />
      ))}
    </section>
  );
}
