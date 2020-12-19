import React from 'react';
import { Spinner } from 'reactstrap';
import { format } from 'date-fns';
import Post from '../../types/Post';
import '../../css/components/postview.css';

interface PostViewProps {
  selectedPost: Post | null
  waitingFetchingPost: boolean
}

function formatPostDateTime(datetime: string) {
  const date = new Date(`${datetime}Z`);
  return format(date, 'yyyy.MM.dd HH:mm');
}

export default function PostView({
  selectedPost, waitingFetchingPost,
}: PostViewProps): JSX.Element {
  return (
    <>
      {(selectedPost || waitingFetchingPost) && (
        <article className={`post${waitingFetchingPost ? ' spinner' : ''}`}>
          {selectedPost && (
            <>
              <header className="post_info">
                <h3 className="title">{selectedPost.title}</h3>
                {selectedPost.createdTime && (
                <span className="created_time">
                  {formatPostDateTime(selectedPost.createdTime)}
                </span>
                )}
                {(selectedPost.updatedTime && selectedPost.updatedTime !== selectedPost.createdTime) && (
                <span className="updated_time">
                  &nbsp;(updated &nbsp;
                    {formatPostDateTime(selectedPost.updatedTime)}
                  )
                </span>
                )}
              </header>
              <main className="post_context">
                {selectedPost.content?.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </main>
            </>
          )}
          {waitingFetchingPost && <Spinner />}
        </article>
      )}
    </>
  );
}
