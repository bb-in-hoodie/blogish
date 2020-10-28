import React, {
  useState, useEffect, useCallback,
} from 'react';
import { Input, Button } from 'reactstrap';
import { debounce } from 'lodash';
import '../../css/components/bloglist.css';
import BlogCard from './BlogCard';
import Blog from '../../types/Blog';
import { BrowseTab } from '../../views/Browse';
import useUser from '../../hooks/useUser';
import { blogsOfOthersAPI, blogsOfUserAPI } from '../../api/BlogAPI';

type BlogListProps = {
  activeTab: BrowseTab;
};

export default function BlogList({ activeTab }: BlogListProps): JSX.Element {
  const user = useUser(true);

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [keyword, setKeyword] = useState('');

  // update blogs by activeTab
  const updateBlogs = useCallback(async () => {
    if (!user?.userId) {
      return;
    }

    try {
      if (activeTab === 'MINE') {
        setBlogs(await blogsOfUserAPI(user.userId));
      } else {
        setBlogs(await blogsOfOthersAPI(user.userId));
      }
    } catch (e) {
      alert('블로그 목록을 불러오는데 실패했습니다.');
    }
  }, [activeTab, user]);

  useEffect(() => {
    setKeyword('');
    updateBlogs();
  }, [updateBlogs]);

  const throttledSetFilteredBlogs = useCallback(debounce((newKeyword: string) => {
    setFilteredBlogs(
      newKeyword
        ? blogs.filter(
          (blog) => blog.title.includes(newKeyword) || blog.description.includes(newKeyword) || blog.owner?.nickname.includes(newKeyword),
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
          key={blog.id}
          id={blog.id}
          title={blog.title}
          description={blog.description}
          owner={blog.owner}
        />
      ))}
    </section>
  );
}
