import React from 'react';
import User from '../../types/User';
import '../../css/components/userheader.css';

type UserHeaderProps = {
  user?: User;
};
export default function UserHeader({ user }: UserHeaderProps): JSX.Element {
  return (
    <div className="user_header">
      { user?.nickname ?? '' }
    </div>
  );
}
