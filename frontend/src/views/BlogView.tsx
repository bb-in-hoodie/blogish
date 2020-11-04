import React from 'react';
import { useParams } from 'react-router-dom';
import { Badge } from 'reactstrap';
import '../css/blog.css';

export default function BlogView(): JSX.Element {
  const { blogId } = useParams() as { blogId: string };

  return (
    <div className="blog">
      <header className="main_header">
        <div className="user_info">
          user name here
        </div>
        <div className="blog_info">
          <h2>Blog Title Here</h2>
          <h5>{ `blog description here ${blogId}` }</h5>
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
