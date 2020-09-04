import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Nav, NavItem, NavLink, Card,
} from 'reactstrap';
import useUser from '../hooks/useUser';
import BlogCard from '../components/browse/BlogCard';
import '../css/browse.css';

type BrowseTab = 'MINE' | 'OTHERS';

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
              OTHERS'
            </NavLink>
          </NavItem>
        </Nav>
        {activeTab === 'MINE'
        && (
        <section>
          <BlogCard
            title="내가 만든 블로그"
            description="내가 만든 블로그에 대한 설명이다."
            blogId=""
          />
          <BlogCard
            title="요리가 좋아요"
            description="요리를 사랑한다면?"
            blogId=""
          />
          <BlogCard
            title="엔비디아는 신인가요?"
            description="황회장님에 대한 믿음으로 가득한 곳."
            blogId=""
          />
        </section>
        )}
        {activeTab === 'OTHERS'
        && (
        <section>
          <BlogCard
            title="남이 만든 블로그"
            description="남이 만든 블로그에 대한 설명이다."
            blogId=""
            user={{ userId: '111', nickname: 'abc' }}
          />
          <BlogCard
            title="요리가 싫어요"
            description="요리를 증오한다면?"
            blogId=""
            user={{ userId: '222', nickname: 'bindy' }}
          />
          <BlogCard
            title="절세미녀"
            description="도대체..."
            blogId=""
            user={{ userId: '333', nickname: 'lselse' }}
          />
        </section>
        )}
      </main>
    </div>
  );
}
