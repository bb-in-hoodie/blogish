import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Button, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';
import { deleteUserAPI } from '../../api/UserAPI';
import { assignUser, EMPTY_USER_INFO } from '../../redux/userSlice';
import User, { UserToDelete } from '../../types/User';
import '../../css/components/deleteprofilemodal.css';

type DeleteProfileModalProps = {
  user: User;
  deleteProfileModalOpen: boolean;
  setDeleteProfileModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DeleteProfileModal({
  user,
  deleteProfileModalOpen,
  setDeleteProfileModalOpen,
}: DeleteProfileModalProps): JSX.Element {
  const history = useHistory();
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const isDeletingEnabled = password.length > 0;
  const toggleDeleteProfileModalOpen = () => setDeleteProfileModalOpen((open) => !open);

  // reset password on modal open
  useEffect(() => {
    if (user && deleteProfileModalOpen) {
      setPassword(user.password ?? '');
    }
  }, [user, deleteProfileModalOpen]);

  async function deleteProfile() {
    try {
      const userToDelete: UserToDelete = {
        userId: user.userId,
        password,
      };
      const result = await deleteUserAPI(userToDelete);
      if (result) {
        dispatch(assignUser({ ...EMPTY_USER_INFO }));
        history.push('/');
      }
    } catch (e) {
      alert('An error occurred while deleting the profile. Please double check the password.');
    }
  }

  function onKeyDownOnForm(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && isDeletingEnabled) {
      deleteProfile();
    }
  }

  return (
    <Modal
      modalClassName="delete_profile_modal"
      isOpen={deleteProfileModalOpen}
      toggle={toggleDeleteProfileModalOpen}
      centered
    >
      <ModalHeader>
        Delete your profile
      </ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="input_password">Password</Label>
          <Input
            id="input_password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => onKeyDownOnForm(e)}
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => setDeleteProfileModalOpen(false)}>Cancel</Button>
        <Button
          color="danger"
          disabled={!isDeletingEnabled}
          onClick={() => deleteProfile()}
        >
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
}
