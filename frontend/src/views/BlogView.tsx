import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Badge } from 'reactstrap';
import { blogInfoAPI } from '../api/BlogAPI';
import '../css/blog.css';
import useUser from '../hooks/useUser';
import Blog from '../types/Blog';

export default function BlogView(): JSX.Element {
  const user = useUser(true);
  const history = useHistory();
  const { blogId } = useParams() as { blogId: string };
  const [blog, setBlog] = useState<Blog | null>(null);

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
          {blog?.description && <h5>{ blog?.description }</h5>}
        </div>
      </header>
      <nav>
        <div className="category_list">
          <Badge color="primary" className="active">ALL</Badge>
          <Badge color="secondary" className="active">Computer</Badge>
          <Badge color="secondary">Daily Life</Badge>
          <Badge color="secondary">Musics</Badge>
          <Badge color="secondary">Movies</Badge>
          <Badge color="secondary">Netflix</Badge>
        </div>
        <div className="post_list">
          <ul>
            <li>the very first movie I&apos;ve watched</li>
            <li>It&apos;s good to go outside</li>
            <li>What a sunny day</li>
          </ul>
        </div>
      </nav>
      <article>
        <header className="post_info">post title</header>
        <main className="post_context">
          and the article goes like this
          on and on
          down and down
          one by one
          line by line
        </main>
      </article>
    </div>
  );
}
