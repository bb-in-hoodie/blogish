import React, { useState } from 'react';
import { Input, Label } from 'reactstrap';
import Blog, { WriteMode } from '../../types/Blog';
import Category from '../../types/Category';
import Post, { TITLE_MAX_LENGTH } from '../../types/Post';
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
  const [contextText, setContextText] = useState('');

  return (
    <main className="write">
      <section className="contents">
        <section className="title">
          <Label for="input_title">
            TITLE
            {title.length > 0
            && (
            <span className="limit">
              (
              {title.length}
              /
              {TITLE_MAX_LENGTH}
              )
            </span>
            )}
          </Label>
          <Input type="text" id="input_title" maxLength={TITLE_MAX_LENGTH} value={title} onChange={(e) => setTitle(e.target.value)} />
        </section>
        <section className="context">
          <Label for="input_context">
            CONTEXT
            {contextText.length > 0 && (
            <span className="limit">
              (
              {contextText.length}
              )
            </span>
            )}
          </Label>
          <Input type="textarea" id="input_context" value={contextText} onChange={(e) => setContextText(e.target.value)} />
        </section>
      </section>
      <section className="submission">
        submission
      </section>
    </main>
  );
}
