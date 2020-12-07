import React from 'react';
import Post from '../../types/Post';

interface PostViewProps {
  post: Post | null
}

export default function PostView({ post }: PostViewProps): JSX.Element {
  return (
    <article>
      {post && (
        <>
          <header className="post_info">
            <h3 className="title">{post.title}</h3>
            {post.createdTime && (
            <span className="created_time">
              written in&nbsp;
              {post.createdTime}
            </span>
            )}
            {(post.updatedTime && post.createdTime !== post.updatedTime) && (
            <span className="updated_time">
              updated in&nbsp;
              {post.updatedTime}
            </span>
            )}
          </header>
          <main className="post_context">
            {post.content ?? ''}
          </main>
        </>
      )}
    </article>
  );
}
