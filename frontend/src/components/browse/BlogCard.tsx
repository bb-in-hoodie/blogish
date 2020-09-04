import React from 'react';
import { Card } from 'reactstrap';
import '../../css/components/blogcard.css';
import User from '../../types/User';

type BlogCardProp = {
  title: string;
  description: string;
  blogId: string;
  user?: User;
};

export default function BlogCard({
  title, description, user,
}: BlogCardProp): JSX.Element {
  return (
    <Card>
      <h4>{title}</h4>
      <p>{description}</p>
      {user && (<div className="user_info">{user.nickname}</div>)}
    </Card>
  );
}
