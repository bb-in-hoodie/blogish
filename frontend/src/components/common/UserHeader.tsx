import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
} from 'reactstrap';
import User from '../../types/User';
import '../../css/components/userheader.css';

type UserHeaderProps = {
  user?: User;
  isBrowseEnabled: boolean;
};
export default function UserHeader({ user, isBrowseEnabled }: UserHeaderProps): JSX.Element {
  const history = useHistory();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((opened) => !opened);

  const onBrowseClicked = () => {
    history.push('/browse');
  };

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
          {isBrowseEnabled && <DropdownItem onClick={onBrowseClicked}>BROWSE</DropdownItem>}
          <DropdownItem onClick={() => null}>LOGOUT</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
