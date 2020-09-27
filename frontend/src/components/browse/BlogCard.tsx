import React from 'react';
import { Card } from 'reactstrap';
import '../../css/components/blogcard.css';
import Blog from '../../types/Blog';

export default function BlogCard({
  title, description, user,
}: Blog): JSX.Element {
  return (
    <Card>
      <h4>{title}</h4>
      <p>{description}</p>
      {user && (<div className="user_info">{user.nickname}</div>)}
    </Card>
  );
}
