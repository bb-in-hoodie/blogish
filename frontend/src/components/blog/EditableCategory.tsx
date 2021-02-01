import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { FiCheck, FiTrash2 } from 'react-icons/fi';
import { IoRefresh } from 'react-icons/io5';
import { Badge } from 'reactstrap';
import { deleteCategoryAPI, updateCategoryAPI } from '../../api/CategoryAPI';
import BlogContext from '../../contexts/BlogContext';
import Category, {
  ALL_CATEGORIES, CategorySelectionState, MAX_CATEGORY_LENGTH,
} from '../../types/Category';

interface EditableCategoryProps {
  category: Category,
  targetCategory: Category | null,
  setTargetCategory: React.Dispatch<React.SetStateAction<Category | null>>,
  categorySelectionState: CategorySelectionState,
  setCategorySelectionState: (nextState: CategorySelectionState) => void
}

const INPUT_MIN_WIDTH = 20;

export default function EditableCategory({
  category,
  targetCategory,
  setTargetCategory,
  categorySelectionState,
  setCategorySelectionState,
}: EditableCategoryProps): JSX.Element {
  const [newName, setNewName] = useState(category.name);
  const [isEditingThis, setIsEditingThis] = useState(false);
  const {
    updateCategories, setActiveCategory, setSelectedPost, setPosts, getPosts,
  } = useContext(BlogContext);
  const inputRef = useRef<HTMLInputElement>(null);

  // set className
  const isEditable = categorySelectionState === 'EDITING';
  let className: 'editing' | 'disabled' | '' = '';
  if (isEditable && targetCategory) {
    className = isEditingThis ? 'editing' : 'disabled';
  } else if (categorySelectionState === 'ADDING') {
    className = 'disabled';
  }

  // click event
  const onCategoryClicked = () => {
    if (!targetCategory && !className) {
      setTargetCategory(category);
    }
  };

  const onSubmitClicked = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (newName.length <= 0) {
      return;
    }

    try {
      await updateCategoryAPI(category.id as number, newName);
      setTargetCategory(null);
      setCategorySelectionState('IDLE');
      if (updateCategories) {
        await updateCategories();
      }
    } catch {
      alert('카테고리를 수정하는 과정에서 에러가 발생했습니다.');
    }
  };

  const onDeleteClicked = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (className === 'disabled') {
      return;
    }

    // eslint-disable-next-line no-restricted-globals
    const confirmed = confirm('카테고리를 삭제하면 해당 카테고리의 게시글도 모두 삭제됩니다. 삭제하시겠습니까?');
    if (confirmed) {
      try {
        await deleteCategoryAPI(category.id as number);
        setTargetCategory(null);
        setCategorySelectionState('IDLE');

        // initialize and re-fetch categories
        if (setActiveCategory && setSelectedPost && updateCategories && setPosts && getPosts) {
          setPosts([]);
          setSelectedPost(null);
          setActiveCategory(ALL_CATEGORIES);
          await updateCategories();
          await getPosts(ALL_CATEGORIES);
        }
      } catch {
        alert('카테고리를 삭제하는 과정에서 에러가 발생했습니다.');
      }
    }
  };

  const onCancelClicked = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTargetCategory(null);
    setNewName(category.name);
  };

  const onEnterDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmitClicked();
    }
  };

  // check if a category currently being edited is this category
  useEffect(() => {
    setIsEditingThis(targetCategory?.id === category.id);
  }, [targetCategory, category]);

  // adjust width of input
  const adjustInputWidth = () => {
    if (inputRef.current) {
      inputRef.current.style.width = `${INPUT_MIN_WIDTH}px`;
      inputRef.current.style.width = `${inputRef.current.scrollWidth}px`;
    }
  };
  adjustInputWidth();

  // if the category starts being edited, focus on its input
  useEffect(() => {
    if (isEditingThis && inputRef.current) {
      inputRef.current.focus();
      adjustInputWidth();
    }
  }, [isEditingThis]);

  return (
    <>
      <Badge
        key={`editable_${category.id ?? 0}`}
        className={`category_button ${isEditable ? 'editable' : ''} ${className}`}
        onClick={onCategoryClicked}
      >
        {!isEditingThis && (
        <>
          {category.name}
          <FiTrash2
            className={`icon delete ${className}`}
            onClick={onDeleteClicked}
          />
        </>
        )}
        {isEditingThis && (
        <>
          <input
            ref={inputRef}
            type="text"
            value={newName}
            maxLength={MAX_CATEGORY_LENGTH}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => onEnterDown(e)}
          />
          <FiCheck
            className={`icon plus${newName.length > 0 ? '' : ' disabled'}`}
            onClick={onSubmitClicked}
          />
        </>
        )}
      </Badge>
      {isEditingThis && (
        <IoRefresh
          className="icon x"
          onClick={onCancelClicked}
        />
      )}
    </>
  );
}
