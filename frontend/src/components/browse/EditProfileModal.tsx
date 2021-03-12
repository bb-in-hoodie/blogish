import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';
import { editUserAPI } from '../../api/UserAPI';
import { assignUser } from '../../redux/userSlice';
import User, {
  InputValidity, USER_NICKNAME_MAX_LENGTH, USER_NICKNAME_MIN_LENGTH, USER_NICKNAME_REGEX,
} from '../../types/User';
import '../../css/components/editprofilemodal.css';

type EditProfileModalProps = {
  user: User;
  editProfileModalOpen: boolean;
  setEditProfileModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditProfileModal({
  user,
  editProfileModalOpen,
  setEditProfileModalOpen,
}: EditProfileModalProps): JSX.Element {
  const dispatch = useDispatch();
  const [nickname, setNickname] = useState(user?.nickname ?? '');
  const [nicknameValidity, setNicknameValidity] = useState<InputValidity>('EMPTY');

  const isEditingEnabled = nicknameValidity === 'VALID';
  const toggleEditProfileModalOpen = () => setEditProfileModalOpen((open) => !open);

  // reset nickname on modal open
  useEffect(() => {
    if (user && editProfileModalOpen) {
      setNickname(user.nickname ?? '');
      setNicknameValidity('EMPTY');
    }
  }, [user, editProfileModalOpen]);

  function onInputChange(input: string) {
    setNickname(input);
    const { length } = input;
    if (length === 0 || user?.nickname === input) {
      setNicknameValidity('EMPTY');
    } else if (length >= USER_NICKNAME_MIN_LENGTH && length <= USER_NICKNAME_MAX_LENGTH) {
      setNicknameValidity(USER_NICKNAME_REGEX.test(input) ? 'VALID' : 'INVALID');
    } else {
      setNicknameValidity('INVALID');
    }
  }

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
      alert('An error occurred while editing the profile.');
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
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => onKeyDownOnForm(e)}
          />
          <footer className="input_validator">
            <span className="input_len">
              {nickname.length}
              /
              {USER_NICKNAME_MAX_LENGTH}
            </span>
            {nicknameValidity === 'VALID'
            && <span className="validity valid">It&apos;a valid nickname.</span>}
            {nicknameValidity === 'INVALID'
            && (
              <span className="validity invalid">
                English characters, numbers and dashes are allowed (
                {USER_NICKNAME_MIN_LENGTH}
                {' '}
                ≤ length ≤
                {' '}
                {USER_NICKNAME_MAX_LENGTH}
                ).
              </span>
            )}
          </footer>
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
