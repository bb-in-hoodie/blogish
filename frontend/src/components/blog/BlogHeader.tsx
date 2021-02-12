import React, { useContext } from 'react';
import BlogContext from '../../contexts/BlogContext';
import '../../css/components/blogheader.css';

export default function BlogHeader(): JSX.Element {
  const { user, blog } = useContext(BlogContext);

  return (
    <header className="main_header">
      <div className="user_info">
        { user?.nickname ?? '' }
      </div>
      <div className="blog_info">
        <h2>{ blog?.title }</h2>
        {blog?.description && <h5 className="description">{ blog?.description }</h5>}
        {blog?.owner.nickname && (
          <span className="nickname">
            @
            { blog?.owner.nickname ?? '' }
          </span>
        )}
      </div>
    </header>
  );
}
