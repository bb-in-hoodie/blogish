import React, {
  useState, useEffect, useCallback,
} from 'react';
import { Input, Button } from 'reactstrap';
import { debounce } from 'lodash';
import BlogCard from './BlogCard';
import Blog from '../../types/Blog';
import { BrowseTab } from '../../views/Browse';
import { blogsOfOthersAPI, blogsOfUserAPI } from '../../api/BlogAPI';
import User from '../../types/User';
import '../../css/components/bloglist.css';

type BlogListProps = {
  user: User;
  activeTab: BrowseTab;
  setCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setBlogToDelete: React.Dispatch<React.SetStateAction<Blog | null>>;
  updateToggle: boolean;
};

export default function BlogList({
  user,
  activeTab,
  setCreateModalOpen,
  setDeleteModalOpen,
  setBlogToDelete,
  updateToggle,
}: BlogListProps): JSX.Element {
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
  }, [activeTab, user, updateToggle]);

  useEffect(() => {
    setKeyword('');
    updateBlogs();
  }, [updateBlogs]);

  // filter blogs by keyword
  const throttledSetFilteredBlogs = useCallback(debounce((newKeyword: string) => {
    setFilteredBlogs(
      newKeyword
        ? blogs.filter(
          (blog) => blog.title.includes(newKeyword)
                    || blog.description.includes(newKeyword)
                    || blog.owner?.nickname.includes(newKeyword),
        )
        : blogs,
    );
  }, 200), [blogs]);

  useEffect(() => {
    if (keyword) {
      throttledSetFilteredBlogs(keyword);
    } else {
      throttledSetFilteredBlogs.cancel();
      setFilteredBlogs(blogs);
    }
  }, [keyword, throttledSetFilteredBlogs, blogs]);

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
        {activeTab === 'MINE' && <Button size="sm" color="primary" onClick={() => setCreateModalOpen(true)}>CREATE</Button>}
      </header>
      {filteredBlogs.map((blog) => (
        <BlogCard
          key={blog.id}
          blog={blog}
          user={user}
          setDeleteModalOpen={setDeleteModalOpen}
          setBlogToDelete={setBlogToDelete}
        />
      ))}
    </section>
  );
}
