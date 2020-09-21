import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Nav, NavItem, NavLink, Card,
} from 'reactstrap';
import useUser from '../hooks/useUser';
import BlogCard from '../components/browse/BlogCard';
import '../css/browse.css';
import BlogList from '../components/browse/BlogList';

export type BrowseTab = 'MINE' | 'OTHERS';

export default function Browse(): JSX.Element {
  const history = useHistory();
  const user = useUser(true);
  const [activeTab, setActiveTab] = useState<BrowseTab>('MINE');

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
        <BlogList activeTab={activeTab} />
      </main>
    </div>
  );
}
