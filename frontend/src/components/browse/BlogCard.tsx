import React from 'react';
import { Card } from 'reactstrap';
import '../../css/components/blogcard.css';
import Blog from '../../types/Blog';

export default function BlogCard({
  id, title, description, owner,
}: Partial<Blog>): JSX.Element {
  return (
    <Card>
      <h4>{title}</h4>
      <p>{description}</p>
      {owner && (<div className="user_info">{owner.nickname}</div>)}
    </Card>
  );
}
