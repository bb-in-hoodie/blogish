import React, { useState } from 'react';
import {
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
} from 'reactstrap';
import User from '../../types/User';
import '../../css/components/userheader.css';

type UserHeaderProps = {
  user?: User;
};
export default function UserHeader({ user }: UserHeaderProps): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((opened) => !opened);

  return (
    <div className="user_header">
      <Dropdown
        className="menu"
        isOpen={isMenuOpen}
        toggle={toggleMenu}
      >
        <DropdownToggle
          className="toggle"
          tag="span"
        >
          { user?.nickname ?? '' }
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem onClick={() => null}>BROWSE</DropdownItem>
          <DropdownItem onClick={() => null}>LOGOUT</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
