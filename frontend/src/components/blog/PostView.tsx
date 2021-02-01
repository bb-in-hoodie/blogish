import React, { useContext, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import {
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Spinner,
} from 'reactstrap';
import { FiMoreVertical } from 'react-icons/fi';
import { format } from 'date-fns';
import { deletePostAPI } from '../../api/PostAPI';
import BlogContext from '../../contexts/BlogContext';
import '../../css/components/postview.css';

interface PostViewProps {
  waitingFetchingSinglePost: boolean,
}

function formatPostDateTime(datetime: string) {
  const date = new Date(`${datetime}Z`);
  return format(date, 'yyyy.MM.dd HH:mm');
}

export default function PostView({ waitingFetchingSinglePost }: PostViewProps): JSX.Element {
  const {
    user, blog, getPosts, selectedPost, setSelectedPost,
  } = useContext(BlogContext);
  const { url } = useRouteMatch();
  const history = useHistory();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((opened) => !opened);

  const onEditClicked = () => {
    history.push(`${url}/edit`);
  };

  const onDeleteClicked = async () => {
    // eslint-disable-next-line no-restricted-globals
    const confirmed = confirm('정말로 게시글을 삭제하시겠습니까?');
    if (confirmed && selectedPost?.id && setSelectedPost && getPosts) {
      await deletePostAPI(selectedPost?.id);
      await getPosts();
      setSelectedPost(null);
    }
  };

  return (
    <>
      {(selectedPost || waitingFetchingSinglePost) && (
        <article className={`post${waitingFetchingSinglePost ? ' spinner' : ''}`}>
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
                      <DropdownItem onClick={onEditClicked}>EDIT</DropdownItem>
                      <DropdownItem onClick={onDeleteClicked}>DELETE</DropdownItem>
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
          {waitingFetchingSinglePost && <Spinner />}
        </article>
      )}
    </>
  );
}
