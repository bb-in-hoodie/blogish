import React from 'react';
import { useParams } from 'react-router-dom';

export default function BlogView(): JSX.Element {
  const { blogId } = useParams() as { blogId: string };

  return (
    <div>
      <h1>Blog</h1>
      blogId:
      {' '}
      { blogId }
    </div>
  );
}
