import React, { useState } from 'react';
import {
  Nav, NavItem, NavLink,
} from 'reactstrap';
import Blog from '../types/Blog';
import useUser from '../hooks/useUser';
import UserHeader from '../components/common/UserHeader';
import BlogList from '../components/browse/BlogList';
import CreateBlogModal from '../components/browse/CreateBlogModal';
import DeleteBlogModal from '../components/browse/DeleteBlogModal';
import '../css/browse.css';

export type BrowseTab = 'MINE' | 'OTHERS';

export default function Browse(): JSX.Element {
  const user = useUser(true);

  const [activeTab, setActiveTab] = useState<BrowseTab>('MINE');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const [updateToggle, setUpdateToggle] = useState(false);

  return (
    <div className="browse">
      <UserHeader user={user} isBrowseEnabled={false} isEditProfileEnabled />
      <header>
        BROWSE
      </header>
      <main>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={activeTab === 'MINE' ? 'active' : ''}
              onClick={() => setActiveTab('MINE')}
            >
              MINE
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === 'OTHERS' ? 'active' : ''}
              onClick={() => setActiveTab('OTHERS')}
            >
              OTHERS&apos;
            </NavLink>
          </NavItem>
        </Nav>
        <BlogList
          user={user}
          activeTab={activeTab}
          setCreateModalOpen={setCreateModalOpen}
          setDeleteModalOpen={setDeleteModalOpen}
          setBlogToDelete={setBlogToDelete}
          updateToggle={updateToggle}
        />
      </main>
      <CreateBlogModal
        user={user}
        createModalOpen={createModalOpen}
        setCreateModalOpen={setCreateModalOpen}
        setUpdateToggle={setUpdateToggle}
      />
      <DeleteBlogModal
        user={user}
        deleteModalOpen={deleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        blogToDelete={blogToDelete}
        setBlogToDelete={setBlogToDelete}
        setUpdateToggle={setUpdateToggle}
        redirectTo={null}
      />
    </div>
  );
}
