import React, { useState, useEffect } from 'react';
import BlogCard from './BlogCard';
import Blog from '../../types/Blog';
import { BrowseTab } from '../../views/Browse';

type BlogListProps = {
  activeTab: BrowseTab;
};

export default function BlogList({ activeTab }: BlogListProps): JSX.Element {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  // TODO: 실제 데이터 사용
  useEffect(() => {
    if (activeTab === 'MINE') {
      setBlogs([
        {
          title: '내가 만든 블로그',
          description: '내가 만든 블로그에 대한 설명이다.',
          blogId: '',
        },
        {
          title: '요리가 좋아요',
          description: '요리를 사랑한다면?',
          blogId: '',
        },
        {
          title: '엔비디아는 신인가요?',
          description: '황회장님에 대한 믿음으로 가득한 곳.',
          blogId: '',
        },
      ]);
    } else {
      setBlogs([
        {
          title: '남이 만든 블로그',
          description: '남이 만든 블로그에 대한 설명이다.',
          blogId: '',
          user: { userId: '111', nickname: 'abc' },
        },
        {
          title: '요리가 싫어요',
          description: '요리를 증오한다면?',
          blogId: '',
          user: { userId: '222', nickname: 'bindy' },
        },
        {
          title: '절세미녀',
          description: '도대체...',
          blogId: '',
          user: { userId: '333', nickname: 'lselse' },
        },
      ]);
    }
  }, [activeTab]);

  return (
    <section>
      {blogs.map((blog) => (
        <BlogCard
          title={blog.title}
          description={blog.description}
          blogId={blog.blogId}
          user={blog.user}
        />
      ))}
    </section>
  );
}
