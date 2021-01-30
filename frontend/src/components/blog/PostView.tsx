import React, { useContext, useState } from 'react';
import {
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Spinner,
} from 'reactstrap';
import { FiMoreVertical } from 'react-icons/fi';
import { format } from 'date-fns';
import Post from '../../types/Post';
import '../../css/components/postview.css';
import BlogContext from '../../contexts/BlogContext';

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
  const { user, blog } = useContext(BlogContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((opened) => !opened);

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
                {(selectedPost.updatedTime
                && selectedPost.updatedTime !== selectedPost.createdTime)
                && (
                <span className="updated_time">
                  &nbsp;(updated &nbsp;
                    {formatPostDateTime(selectedPost.updatedTime)}
                  )
                </span>
                )}
                {user?.userId === blog?.owner.userId && (
                  <Dropdown
                    className="menu"
                    isOpen={isMenuOpen}
                    toggle={toggleMenu}
                  >
                    <DropdownToggle className="toggle">
                      <FiMoreVertical />
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>EDIT</DropdownItem>
                      <DropdownItem>DELETE</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                )}
              </header>
              <main className="post_content">
                {selectedPost.content?.split('\n').map((line, index) => (
                  line ? <p key={index}>{line}</p> : <br key={index} />
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
