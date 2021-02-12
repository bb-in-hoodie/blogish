import React, { useState } from 'react';
import {
  Button, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';
import { updateBlogAPI } from '../../api/BlogAPI';
import User from '../../types/User';
import Blog, { BLOG_DESCRIPTION_MAX_LENGTH, BLOG_TITLE_MAX_LENGTH } from '../../types/Blog';
import '../../css/components/createblogmodal.css';

type EditeBlogModalProps = {
  user: User;
  blog: Blog;
  editModalOpen: boolean;
  setEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateBlog: () => Promise<void>;
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

export default function EditBlogModal({
  user,
  blog,
  editModalOpen,
  setEditModalOpen,
  updateBlog,
}: EditeBlogModalProps): JSX.Element {
  const [title, setTitle] = useState(blog.title ?? '');
  const [description, setDescription] = useState(blog.description ?? '');

  const toggleCreateModalOpen = () => setEditModalOpen((open) => !open);

  async function editBlog() {
    if (title.length === 0) {
      return;
    }

    try {
      await updateBlogAPI(blog.id, { title, description, userId: user.userId });
      await updateBlog();
      setEditModalOpen(false);
    } catch (e) {
      if (e.response.status === 400) { // bad request
        alert('이미 같은 이름의 블로그를 사용하고 있습니다.');
      } else {
        alert('블로그를 수정하는 과정에서 에러가 발생했습니다.');
      }
    }
  }

  function onKeyDownOnForm(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      editBlog();
    }
  }

  function onModalClosed() {
    // initalize
    setTitle(blog.title ?? '');
    setDescription(blog.description ?? '');
  }

  return (
    <Modal
      modalClassName="create_modal"
      isOpen={editModalOpen}
      toggle={toggleCreateModalOpen}
      onClosed={onModalClosed}
      centered
    >
      <ModalHeader>
        Edit the blog information
      </ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="input_title">Title</Label>
          <Input
            id="input_title"
            type="text"
            value={title}
            onChange={(e) => onInputChange(e, BLOG_TITLE_MAX_LENGTH, setTitle)}
            onKeyDown={(e) => onKeyDownOnForm(e)}
          />
          <span className="input_len">
            {title.length}
            /
            {BLOG_TITLE_MAX_LENGTH}
          </span>
        </FormGroup>
        <FormGroup>
          <Label for="input_desc">Description</Label>
          <Input
            id="input_desc"
            type="text"
            value={description}
            onChange={(e) => onInputChange(e, BLOG_DESCRIPTION_MAX_LENGTH, setDescription)}
            onKeyDown={(e) => onKeyDownOnForm(e)}
          />
          <span className="input_len">
            {description.length}
            /
            {BLOG_DESCRIPTION_MAX_LENGTH}
          </span>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => setEditModalOpen(false)}>Cancel</Button>
        <Button
          color="primary"
          disabled={title.length === 0}
          onClick={() => editBlog()}
        >
          Edit
        </Button>
      </ModalFooter>
    </Modal>
  );
}
