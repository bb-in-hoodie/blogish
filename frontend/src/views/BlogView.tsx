import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { blogInfoAPI } from '../api/BlogAPI';
import useUser from '../hooks/useUser';
import Blog from '../types/Blog';
import Post from '../types/Post';
import BlogNav from '../components/blog/BlogNav';
import '../css/blog.css';
import PostView from '../components/blog/PostView';

export default function BlogView(): JSX.Element {
  const user = useUser(true);
  const history = useHistory();
  const { blogId } = useParams() as { blogId: string };
  const [blog, setBlog] = useState<Blog | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    if (!blogId) {
      history.push('/browse');
    }

    async function updateBlog() {
      try {
        const blogInfo = await blogInfoAPI(parseInt(blogId, 10));
        setBlog(blogInfo);
      } catch (e) {
        alert('블로그를 불러오는데 실패했습니다.');
        history.push('/browse');
      }
    }
    updateBlog();
  }, [blogId]);

  return (
    <div className="blog">
      <header className="main_header">
        <div className="user_info">
          { user.nickname }
        </div>
        <div className="blog_info">
          <h2>{ blog?.title }</h2>
          {blog?.description && <h5 className="description">{ blog?.description }</h5>}
          <span className="nickname">
            @
            { blog?.owner.nickname }
          </span>
        </div>
      </header>
      <BlogNav blog={blog} selectedPost={selectedPost} setSelectedPost={setSelectedPost} />
      {selectedPost && <PostView post={selectedPost} />}
    </div>
  );
}
