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
          {blog?.description && <h5 className="description">{ blog?.description }</h5>}
          <span className="nickname">
            @
            { blog?.owner.nickname }
          </span>
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
            <li className="hover">
              <span className="title">the very first movie I&apos;ve watched</span>
              <span className="created_time">2020.05.14 13:10</span>
            </li>
            <li>
              <span className="title">It&apos;s good to go outside</span>
              <span className="created_time">2020.05.05 18:11</span>
            </li>
            <li>
              <span className="title">What a sunny day</span>
              <span className="created_time">2020.02.14 09:30</span>
            </li>
          </ul>
          {/* paging component */}
        </div>
      </nav>
      <article>
        <header className="post_info">
          <h3 className="title">the very first movie I&apos;ve watched</h3>
          <span className="created_time">작성 2020.05.14 13:10</span>
        </header>
        <main className="post_context">
          <p>
            and the article goes like this
            <br />
            on and on
            <br />
            down and down
            <br />
            one by one
            <br />
            line by line
          </p>
          <p>
            and the article goes like this
            <br />
            on and on
            <br />
            down and down
            <br />
            one by one
            <br />
            line by line
          </p>
        </main>
      </article>
    </div>
  );
}
