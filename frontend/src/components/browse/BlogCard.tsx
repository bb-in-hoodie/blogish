import React from 'react';
import { useHistory } from 'react-router-dom';
import { Card } from 'reactstrap';
import '../../css/components/blogcard.css';
import Blog from '../../types/Blog';

export default function BlogCard({
  id, title, description, owner,
}: Partial<Blog>): JSX.Element {
  const history = useHistory();

  function onCardClicked(blogId?: number) {
    history.push(`/blog/${blogId || ''}`);
  }

  return (
    <Card onClick={() => onCardClicked(id)}>
      <h4>{title}</h4>
      <span>{description}</span>
      {owner && (<div className="user_info">{owner.nickname}</div>)}
    </Card>
  );
}
