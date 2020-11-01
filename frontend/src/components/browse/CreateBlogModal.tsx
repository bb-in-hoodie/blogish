import React, { useState } from 'react';
import {
  Button, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';
import { createBlogAPI } from '../../api/BlogAPI';
import '../../css/components/createblogmodal.css';
import User from '../../types/User';

type CreateBlogModalProps = {
  user: User;
  createModalOpen: boolean;
  setCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdateToggle: React.Dispatch<React.SetStateAction<boolean>>;
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

export default function CreateBlogModal({
  user,
  createModalOpen,
  setCreateModalOpen,
  setUpdateToggle,
}: CreateBlogModalProps): JSX.Element {
  const TITLE_MAX_LENGTH = 45;
  const DESCRIPTION_MAX_LENGTH = 100;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const toggleCreateModalOpen = () => setCreateModalOpen((open) => !open);

  async function createBlog() {
    try {
      await createBlogAPI({ title, description, userId: user.userId });
      setUpdateToggle((toggle) => !toggle);
      setCreateModalOpen(false);
    } catch (e) {
      alert('블로그를 생성하는 과정에서 에러가 발생했습니다.');
    }
  }

  function onModalClosed() {
    // initalize
    setTitle('');
    setDescription('');
  }

  return (
    <Modal
      modalClassName="create_modal"
      isOpen={createModalOpen}
      toggle={toggleCreateModalOpen}
      onClosed={onModalClosed}
      centered
    >
      <ModalHeader>
        Create a blog
      </ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="input_title">Title</Label>
          <Input
            id="input_title"
            type="text"
            value={title}
            onChange={(e) => onInputChange(e, TITLE_MAX_LENGTH, setTitle)}
          />
          <span className="input_len">
            {title.length}
            /
            {TITLE_MAX_LENGTH}
          </span>
        </FormGroup>
        <FormGroup>
          <Label for="input_desc">Description</Label>
          <Input
            id="input_desc"
            type="text"
            value={description}
            onChange={(e) => onInputChange(e, DESCRIPTION_MAX_LENGTH, setDescription)}
          />
          <span className="input_len">
            {description.length}
            /
            {DESCRIPTION_MAX_LENGTH}
          </span>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
        <Button
          color="primary"
          disabled={title.length === 0}
          onClick={() => createBlog()}
        >
          Create
        </Button>
      </ModalFooter>
    </Modal>
  );
}
