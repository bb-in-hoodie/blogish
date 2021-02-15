import React, { useContext, useState } from 'react';
import {
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
} from 'reactstrap';
import { FiMoreVertical } from 'react-icons/fi';
import BlogContext from '../../contexts/BlogContext';
import DeleteBlogModal from '../browse/DeleteBlogModal';
import EditBlogModal from './EditBlogModal';
import '../../css/components/blogheader.css';

export default function BlogHeader(): JSX.Element {
  // header
  const { user, blog, updateBlog } = useContext(BlogContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((opened) => !opened);

  // modals
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <header className="main_header">
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
            direction="up"
          >
            <DropdownToggle className="toggle">
              <FiMoreVertical />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem onClick={() => setEditModalOpen(true)}>EDIT</DropdownItem>
              <DropdownItem onClick={() => setDeleteModalOpen(true)}>DELETE</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </div>

      {blog && user && updateBlog && (
        <>
          <EditBlogModal
            user={user}
            blog={blog}
            editModalOpen={editModalOpen}
            setEditModalOpen={setEditModalOpen}
            updateBlog={updateBlog}
          />
          <DeleteBlogModal
            user={user}
            deleteModalOpen={deleteModalOpen}
            setDeleteModalOpen={setDeleteModalOpen}
            blogToDelete={blog}
            setBlogToDelete={null}
            setUpdateToggle={null}
            redirectTo="/browse"
          />
        </>
      )}
    </header>
  );
}
