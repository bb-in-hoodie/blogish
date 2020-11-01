import React, { useState } from 'react';
import {
  Nav, NavItem, NavLink,
} from 'reactstrap';
import '../css/browse.css';
import BlogList from '../components/browse/BlogList';
import CreateBlogModal from '../components/browse/CreateBlogModal';
import useUser from '../hooks/useUser';

export type BrowseTab = 'MINE' | 'OTHERS';

export default function Browse(): JSX.Element {
  const user = useUser(true);

  const [activeTab, setActiveTab] = useState<BrowseTab>('MINE');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateToggle, setUpdateToggle] = useState(false);

  return (
    <div className="browse">
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
          updateToggle={updateToggle}
        />
      </main>
      <CreateBlogModal
        user={user}
        createModalOpen={createModalOpen}
        setCreateModalOpen={setCreateModalOpen}
        setUpdateToggle={setUpdateToggle}
      />
    </div>
  );
}
