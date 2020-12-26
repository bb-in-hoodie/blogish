import React, { useState } from 'react';
import { Input, Label } from 'reactstrap';
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
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');

  return (
    <main className="write">
      <section className="contents">
        <section className="title">
          <Label for="input_title">TITLE</Label>
          <Input type="text" id="input_title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </section>
        <section className="context">
          <Label for="input_context">CONTEXT</Label>
          <Input type="textarea" id="input_context" value={context} onChange={(e) => setContext(e.target.value)} />
        </section>
      </section>
      <section className="submission">
        submission
      </section>
    </main>
  );
}
