import React from 'react';
import { FiX } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { Card } from 'reactstrap';
import '../../css/components/blogcard.css';
import Blog from '../../types/Blog';
import User from '../../types/User';

type BlogCardProps = {
  user: User,
  blog: Blog,
  setDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setBlogToDelete: React.Dispatch<React.SetStateAction<Blog | null>>;
 };

export default function BlogCard({
  blog, user, setDeleteModalOpen, setBlogToDelete,
}: BlogCardProps): JSX.Element {
  const history = useHistory();

  function onCardClicked() {
    history.push(`/blog/${blog.id}`);
  }

  function onDeleteClicked(e: React.MouseEvent) {
    e.stopPropagation();
    setBlogToDelete(blog);
    setDeleteModalOpen(true);
  }

  return (
    <Card onClick={() => onCardClicked()}>
      <h4>{blog.title}</h4>
      <span>{blog.description}</span>
      {blog.owner?.userId === user.userId
        ? <FiX className="icon delete" onClick={onDeleteClicked} />
        : <div className="user_info">{blog.owner?.nickname ?? ''}</div>}
    </Card>
  );
}
