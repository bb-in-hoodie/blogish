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

interface WriteProps {
  mode: WriteMode,
  categories: Category[],
  initialCategory: Category | null,
  selectedPost: Post | null,
}

export default function Write({
  mode, categories, initialCategory, selectedPost,
}: WriteProps): JSX.Element {
  const { user, blog, updateCategories } = useContext(BlogContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [curState, setCurState] = useState<CategorySelectionState>('IDLE'); // IDLE | ADDING (EDITING is not available)
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [waitingAPI, setWaitingAPI] = useState(false);
  const history = useHistory();

  // initial category
  useEffect(() => {
    if (activeCategory || categories?.length === 0) {
      return;
    }

    const category = (!initialCategory || initialCategory?.id === ALL_CATEGORIES.id)
      ? categories?.[0]
      : initialCategory as Category;
    setActiveCategory(category);
  }, [categories, initialCategory, activeCategory, setActiveCategory]);

  // user validation
  useEffect(() => {
    if (user && blog && user.userId !== blog.owner.userId) {
      alert('포스트 작성은 블로그 주인만 할 수 있습니다.');
      history.push(`/blog/${blog?.id}`);
    }
  }, [user, blog, history]);

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
        alert('새로운 카테고리를 생성하는 과정에서 에러가 발생했습니다.');
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
      const result = mode === 'WRITE'
        ? await createPostAPI(post)
        : undefined; // TODO: edit API
      if (result) {
        history.push(`/blog/${blog?.id}`);
      } else {
        throw new Error('Invalid result.');
      }
    } catch (e) {
      const alertText = mode === 'WRITE' ? '게시글 작성에 실패했습니다.' : '게시글 수정에 실패했습니다.';
      alert(alertText);
      setWaitingAPI(false);
    }
  }, [curState, updateCategories, newCategoryName, mode, blog, history]);

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
