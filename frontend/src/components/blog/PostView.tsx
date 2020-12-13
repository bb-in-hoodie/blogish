import React from 'react';
import { format } from 'date-fns';
import Post from '../../types/Post';
import '../../css/components/postview.css';

interface PostViewProps {
  post: Post | null
}

function formatPostDateTime(datetime: string) {
  const date = new Date(`${datetime}Z`);
  return format(date, 'yyyy.MM.dd HH:mm');
}

export default function PostView({ post }: PostViewProps): JSX.Element {
  return (
    <article className="post">
      {post && (
        <>
          <header className="post_info">
            <h3 className="title">{post.title}</h3>
            {post.createdTime && (
            <span className="created_time">
              {formatPostDateTime(post.createdTime)}
            </span>
            )}
            {(post.updatedTime && post.updatedTime !== post.createdTime) && (
            <span className="updated_time">
              &nbsp;(updated &nbsp;
              {formatPostDateTime(post.updatedTime)}
              )
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
