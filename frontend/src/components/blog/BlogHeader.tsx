import React, { useContext, useState } from 'react';
import {
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
} from 'reactstrap';
import { FiMoreVertical } from 'react-icons/fi';
import BlogContext from '../../contexts/BlogContext';
import '../../css/components/blogheader.css';
import DeleteBlogModal from '../browse/DeleteBlogModal';

export default function BlogHeader(): JSX.Element {
  // header
  const { user, blog } = useContext(BlogContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((opened) => !opened);

  // modals
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // click events
  const onEditClicked = () => null;

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
              <DropdownItem onClick={() => setDeleteModalOpen(true)}>DELETE</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </div>

      {blog && user && (
        <DeleteBlogModal
          user={user}
          deleteModalOpen={deleteModalOpen}
          setDeleteModalOpen={setDeleteModalOpen}
          blogToDelete={blog}
          setBlogToDelete={null}
          setUpdateToggle={null}
          redirectTo="/browse"
        />
      )}
    </header>
  );
}
