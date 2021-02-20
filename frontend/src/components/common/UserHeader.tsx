import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
} from 'reactstrap';
import { assignUser, EMPTY_USER_INFO } from '../../redux/userSlice';
import { logoutAPI } from '../../api/UserAPI';
import User from '../../types/User';
import '../../css/components/userheader.css';

type UserHeaderProps = {
  user?: User;
  isBrowseEnabled: boolean;
  isEditEnabled: boolean;
};

export default function UserHeader({
  user,
  isBrowseEnabled,
  isEditEnabled,
}: UserHeaderProps): JSX.Element {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((opened) => !opened);

  const onBrowseClicked = () => {
    history.push('/browse');
  };

  const onLogoutClicked = async () => {
    try {
      const result = await logoutAPI();
      if (result) {
        dispatch(assignUser({ ...EMPTY_USER_INFO }));
        history.push('/');
      } else {
        alert('로그아웃에 실패했습니다.');
      }
    } catch (e) {
      alert('로그아웃을 하는 중 에러가 발생했습니다.');
    }
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
          {isEditEnabled && <DropdownItem onClick={onBrowseClicked}>EDIT PROFILE</DropdownItem>}
          <DropdownItem onClick={onLogoutClicked}>LOGOUT</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
