import React from 'react';
import Blog, { WriteMode } from '../../types/Blog';
import Category from '../../types/Category';
import Post from '../../types/Post';
import '../../css/components/write.css';

interface WriteProps {
  mode: WriteMode,
  blog: Blog | null,
  categories: Category[],
  activeCategoryId: number,
  selectedPost: Post | null,
}

export default function Write({
  mode, blog, categories, activeCategoryId, selectedPost,
}: WriteProps): JSX.Element {
  return (
    <main className="write">
      <section className="contents">
        <header className="title">title</header>
        <main className="context">context</main>
      </section>
      <section className="submission">
        submission
      </section>
    </main>
  );
}
