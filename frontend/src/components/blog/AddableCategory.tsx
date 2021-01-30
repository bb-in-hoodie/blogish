import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { FiCheck } from 'react-icons/fi';
import { IoRefresh } from 'react-icons/io5';
import { Badge } from 'reactstrap';
import { createCategoryAPI } from '../../api/BlogAPI';
import BlogContext from '../../contexts/BlogContext';
import Category, {
  CategorySelectionState, CategorySelectionType, MAX_CATEGORY_LENGTH,
} from '../../types/Category';

interface AddableCategoryProps {
  targetCategory: Category | null,
  categorySelectionState: CategorySelectionState,
  setCategorySelectionState: (nextState: CategorySelectionState) => void,
  categorySelectionType: CategorySelectionType,
  newCategoryName: string,
  setNewCategoryName: React.Dispatch<React.SetStateAction<string>>
}

const INPUT_MIN_WIDTH = 75;

export default function AddableCategory({
  targetCategory,
  categorySelectionState,
  setCategorySelectionState,
  categorySelectionType,
  newCategoryName,
  setNewCategoryName,
}: AddableCategoryProps): JSX.Element {
  const { blog, updateCategories } = useContext(BlogContext);
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isAddable = categorySelectionType === 'ADDABLE';
  const isDisabled = !isAddable && targetCategory; // always enabled on ADDABLE type
  const isEditable = categorySelectionState === 'EDITING';

  // click event
  const onCategoryClicked = () => {
    if (!isDisabled) {
      setCategorySelectionState('ADDING');
    }
  };

  const onSubmitClicked = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (newCategoryName.length <= 0 || blog?.id === undefined) {
      return;
    }

    try {
      await createCategoryAPI(blog?.id, newCategoryName);
      setCategorySelectionState('IDLE');
      setNewCategoryName('');
      if (updateCategories) {
        await updateCategories();
      }
    } catch {
      alert('카테고리를 생성하는 과정에서 에러가 발생했습니다.');
    }
  };

  const onCancelClicked = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNewCategoryName('');
    setCategorySelectionState('EDITING');
  };

  const onEnterDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmitClicked();
    }
  };

  // it's active if current state is ADDING
  useEffect(() => {
    setIsAdding(categorySelectionState === 'ADDING');
  }, [categorySelectionState]);

  // focus on input on active
  useEffect(() => {
    if (inputRef.current && isAdding) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  // adjust width of input
  if (inputRef.current) {
    inputRef.current.style.width = `${INPUT_MIN_WIDTH}px`;
    inputRef.current.style.width = `${inputRef.current.scrollWidth}px`;
  }

  return (
    <>
      <Badge
        className={`category_button addable ${isAddable ? 'addable_type' : ''} ${isEditable ? 'editable' : ''} ${isDisabled ? 'disabled' : ''}${isAdding ? 'adding' : ''}`}
        onClick={onCategoryClicked}
      >
        {categorySelectionState === 'ADDING'
          ? (
            <>
              <input
                ref={inputRef}
                type="text"
                value={newCategoryName}
                maxLength={MAX_CATEGORY_LENGTH}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => onEnterDown(e)}
              />
              {categorySelectionType === 'EDITABLE' && (
              <>
                <FiCheck
                  className={`icon plus${newCategoryName.length > 0 ? '' : ' disabled'}`}
                  onClick={onSubmitClicked}
                />
              </>
              )}
            </>
          )
          : 'ADD'}
      </Badge>
      {categorySelectionState === 'ADDING' && categorySelectionType === 'EDITABLE' && (
        <IoRefresh
          className="icon x"
          onClick={onCancelClicked}
        />
      )}
    </>
  );
}
