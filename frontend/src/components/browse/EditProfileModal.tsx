import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';
import User, { USER_NICKNAME_MAX_LENGTH } from '../../types/User';
import '../../css/components/editprofilemodal.css';
import { editUserAPI } from '../../api/UserAPI';
import { assignUser } from '../../redux/userSlice';

type EditProfileModalProps = {
  user: User;
  editProfileModalOpen: boolean;
  setEditProfileModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function onInputChange(
  e: React.ChangeEvent<HTMLInputElement>,
  maxLen: number,
  setValue: React.Dispatch<React.SetStateAction<string>>,
) {
  const text = e.target.value;
  if (text.length <= maxLen) {
    setValue(text);
  }
}

export default function EditProfileModal({
  user,
  editProfileModalOpen,
  setEditProfileModalOpen,
}: EditProfileModalProps): JSX.Element {
  const dispatch = useDispatch();
  const [nickname, setNickname] = useState(user?.nickname ?? '');
  const isEditingEnabled = nickname.length > 0 && user?.nickname !== nickname;
  const toggleEditProfileModalOpen = () => setEditProfileModalOpen((open) => !open);

  // reset nickname on modal open
  useEffect(() => {
    if (user && editProfileModalOpen) {
      setNickname(user.nickname ?? '');
    }
  }, [user, editProfileModalOpen]);

  async function editProfile() {
    try {
      const userToEdit: User = {
        userId: user.userId,
        nickname,
      };
      const editedUser = await editUserAPI(userToEdit);
      dispatch(assignUser(editedUser));
      setEditProfileModalOpen(false);
    } catch (e) {
      alert('프로필을 수정하는 과정에서 에러가 발생했습니다.');
    }
  }

  function onKeyDownOnForm(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && isEditingEnabled) {
      editProfile();
    }
  }

  return (
    <Modal
      modalClassName="edit_profile_modal"
      isOpen={editProfileModalOpen}
      toggle={toggleEditProfileModalOpen}
      centered
    >
      <ModalHeader>
        Edit your profile
      </ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="input_nickname">Nickname</Label>
          <Input
            id="input_nickname"
            type="text"
            maxLength={USER_NICKNAME_MAX_LENGTH}
            value={nickname}
            onChange={(e) => onInputChange(e, USER_NICKNAME_MAX_LENGTH, setNickname)}
            onKeyDown={(e) => onKeyDownOnForm(e)}
          />
          <span className="input_len">
            {nickname.length}
            /
            {USER_NICKNAME_MAX_LENGTH}
          </span>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => setEditProfileModalOpen(false)}>Cancel</Button>
        <Button
          color="primary"
          disabled={!isEditingEnabled}
          onClick={() => editProfile()}
        >
          Edit
        </Button>
      </ModalFooter>
    </Modal>
  );
}
