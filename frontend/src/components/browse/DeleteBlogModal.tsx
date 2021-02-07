import React, { useState } from 'react';
import {
  Button, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';
import { deleteBlogAPI } from '../../api/BlogAPI';
import User from '../../types/User';
import Blog from '../../types/Blog';
import '../../css/components/deleteblogmodal.css';

type DeleteBlogModalProps = {
  user: User;
  deleteModalOpen: boolean;
  setDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  blogToDelete: Blog | null,
  setBlogToDelete: React.Dispatch<React.SetStateAction<Blog | null>>;
  setUpdateToggle: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DeleteBlogModal({
  user,
  deleteModalOpen,
  setDeleteModalOpen,
  blogToDelete,
  setBlogToDelete,
  setUpdateToggle,
}: DeleteBlogModalProps): JSX.Element {
  const [password, setPassword] = useState('');
  const toggleDeleteModalOpen = () => setDeleteModalOpen((open) => !open);

  async function deleteBlog() {
    if (!blogToDelete) {
      return;
    }

    try {
      await deleteBlogAPI(blogToDelete.id, user.userId, password);
      setUpdateToggle((toggle) => !toggle);
      setDeleteModalOpen(false);
    } catch (e) {
      alert('블로그를 삭제하는 과정에서 에러가 발생했습니다. 비밀번호를 다시 확인해주세요.');
    }
  }

  function onKeyDownOnForm(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      deleteBlog();
    }
  }

  function onModalClosed() {
    // initalize
    setPassword('');
    setBlogToDelete(null);
  }

  return (
    <Modal
      modalClassName="delete_modal"
      isOpen={deleteModalOpen}
      toggle={toggleDeleteModalOpen}
      onClosed={onModalClosed}
      centered
    >
      <ModalHeader>
        Delete
        {' '}
        {blogToDelete?.title ?? ''}
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
        <Button color="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
        <Button
          color="danger"
          disabled={password.length === 0}
          onClick={() => deleteBlog()}
        >
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
}
