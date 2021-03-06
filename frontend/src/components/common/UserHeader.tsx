import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
} from 'reactstrap';
import { assignUser, EMPTY_USER_INFO } from '../../redux/userSlice';
import { logoutAPI } from '../../api/UserAPI';
import User from '../../types/User';
import EditProfileModal from '../browse/EditProfileModal';
import DeleteProfileModal from '../browse/DeleteProfileModal';
import '../../css/components/userheader.css';

type UserHeaderProps = {
  user?: User;
  isBrowseEnabled: boolean;
  isEditProfileEnabled: boolean;
  isDeleteProfileEnabled: boolean;
};

export default function UserHeader({
  user,
  isBrowseEnabled,
  isEditProfileEnabled,
  isDeleteProfileEnabled,
}: UserHeaderProps): JSX.Element {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [deleteProfileModalOpen, setDeleteProfileModalOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((opened) => !opened);

  const onBrowseClicked = () => {
    history.push('/browse');
  };

  const onEditProfileClicked = () => {
    setEditProfileModalOpen(true);
  };

  const onDeleteProfileClicked = () => {
    setDeleteProfileModalOpen(true);
  };

  const onLogoutClicked = async () => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('로그아웃 하시겠습니까?')) {
      return;
    }

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
          {isEditProfileEnabled
          && <DropdownItem onClick={onEditProfileClicked}>EDIT</DropdownItem>}
          {isDeleteProfileEnabled
          && <DropdownItem onClick={onDeleteProfileClicked}>DELETE</DropdownItem>}
          <DropdownItem onClick={onLogoutClicked}>LOGOUT</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {user && isEditProfileEnabled
      && (
        <EditProfileModal
          user={user}
          editProfileModalOpen={editProfileModalOpen}
          setEditProfileModalOpen={setEditProfileModalOpen}
        />
      )}

      {user && isDeleteProfileEnabled
      && (
        <DeleteProfileModal
          user={user}
          deleteProfileModalOpen={deleteProfileModalOpen}
          setDeleteProfileModalOpen={setDeleteProfileModalOpen}
        />
      )}
    </div>
  );
}
