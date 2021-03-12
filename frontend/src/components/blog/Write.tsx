import React, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Input, Label } from 'reactstrap';
import BlogContext from '../../contexts/BlogContext';
import { WriteMode } from '../../types/Blog';
import Category, { ALL_CATEGORIES, CategorySelectionState } from '../../types/Category';
import Post, { TITLE_MAX_LENGTH } from '../../types/Post';
import { createCategoryAPI, createPostAPI } from '../../api/BlogAPI';
import AddableCategorySelection from './AddableCategorySelection';
import '../../css/components/write.css';
import { updatePostAPI } from '../../api/PostAPI';

interface WriteProps {
  mode: WriteMode,
  categories: Category[],
  initialCategory: Category | null
}

export default function Write({
  mode, categories, initialCategory,
}: WriteProps): JSX.Element {
  const {
    user,
    blog,
    updateCategories,
    selectedPost,
    setSelectedPost,
    setActiveCategory: setGlobalActiveCategory,
  } = useContext(BlogContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [curState, setCurState] = useState<CategorySelectionState>('IDLE'); // IDLE | ADDING (EDITING is not available)
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [waitingAPI, setWaitingAPI] = useState(false);
  const history = useHistory();

  // initial category
  useEffect(() => {
    if (activeCategory || !categories || categories.length === 0) {
      return;
    }

    if (initialCategory && initialCategory.id !== ALL_CATEGORIES.id) {
      setActiveCategory(initialCategory);
    } else {
      let category;
      if (mode === 'EDIT') {
        category = categories.find((c) => c.id === selectedPost?.categoryId);
      }
      setActiveCategory(category ?? categories[0]);
    }
  }, [categories, initialCategory, activeCategory, setActiveCategory]);

  // user validation
  useEffect(() => {
    if (user && blog && user.userId !== blog.owner.userId) {
      alert('Only the blog owner can write a post.');
      history.push(`/blog/${blog?.id}`);
    }
  }, [user, blog, history]);

  // fill in selected post's values on edit mode (category will be selected above)
  useEffect(() => {
    if (mode === 'EDIT' && selectedPost) {
      setTitle(selectedPost.title);
      setContent(selectedPost.content ?? '');
    }
  }, [mode, selectedPost]);

  // buttons
  const onCancelClicked = useCallback(() => {
    history.push(`/blog/${blog?.id}`);
  }, [blog, history]);

  const onSubmitClicked = useCallback(async (
    postTitle: string, postContent: string, postCategory: Category | null,
  ) => {
    // blog validation
    if (!blog) {
      return;
    }

    // create a category if needed
    let category = postCategory;

    if (curState === 'ADDING') {
      try {
        category = await createCategoryAPI(blog.id, newCategoryName);
        if (updateCategories) {
          await updateCategories();
        }
      } catch (e) {
        alert('An error occurred while creating a new category.');
        return;
      }
    }

    // category validation
    if (!category?.id) {
      return;
    }

    const post: Post = {
      title: postTitle,
      content: postContent,
      categoryId: category.id,
      blogId: blog.id,
    };

    try {
      setWaitingAPI(true);

      // create or edit a post
      let result;
      if (mode === 'WRITE') {
        result = await createPostAPI(post);
      } else if (selectedPost?.id) {
        result = await updatePostAPI({ ...post, id: selectedPost.id });
      }

      if (result) {
        // select the new post and redirect to blog
        if (setSelectedPost && setGlobalActiveCategory) {
          setGlobalActiveCategory(category);
          setSelectedPost(result);
        }
        history.push(`/blog/${blog?.id}`);
      } else {
        throw new Error('Invalid result.');
      }
    } catch (e) {
      const alertText = mode === 'WRITE' ? 'Failed to write a post.' : 'Failed to edit the post.';
      alert(alertText);
      setWaitingAPI(false);
    }
  }, [curState, updateCategories, newCategoryName, selectedPost, mode, blog, history]);

  const isSubmitDisabled = (curState === 'ADDING' && !newCategoryName)
                          || !activeCategory
                          || title.length <= 0
                          || waitingAPI;

  return (
    <section className="write">
      <main className="input_wrapper">
        <section className="title">
          <Label for="input_title">
            TITLE
            {title.length > 0
              ? (
                <span className="limit">
                  (
                  {title.length}
                  /
                  {TITLE_MAX_LENGTH}
                  )
                </span>
              )
              : '*'}
          </Label>
          <Input type="text" id="input_title" maxLength={TITLE_MAX_LENGTH} value={title} onChange={(e) => setTitle(e.target.value)} />
        </section>
        <section className="content">
          <Label for="input_content">
            BODY
            {content.length > 0 && (
            <span className="limit">
              (
              {content.length}
              )
            </span>
            )}
          </Label>
          <Input type="textarea" id="input_content" value={content} onChange={(e) => setContent(e.target.value)} />
        </section>
        <section className="category">
          <Label>
            CATEGORY
            {!activeCategory && '*'}
          </Label>
          <AddableCategorySelection
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            newCategoryName={newCategoryName}
            setNewCategoryName={setNewCategoryName}
            curState={curState}
            setCurState={setCurState}
          />
        </section>
      </main>
      <footer>
        <Button className="cancel" onClick={onCancelClicked} disabled={waitingAPI}>CANCEL</Button>
        <Button
          className="submit"
          color="success"
          disabled={isSubmitDisabled}
          onClick={() => onSubmitClicked(title, content, activeCategory)}
        >
          {mode === 'WRITE' ? 'POST' : 'EDIT'}
        </Button>
      </footer>
    </section>
  );
}
