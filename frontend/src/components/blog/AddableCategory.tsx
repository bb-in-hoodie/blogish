import React, { useContext, useState } from 'react';
import { FiPlusCircle, FiXCircle } from 'react-icons/fi';
import { Badge } from 'reactstrap';
import { createCategoryAPI } from '../../api/BlogAPI';
import BlogContext from '../../contexts/BlogContext';
import Category, { CategorySelectionState, CategorySelectionType, MAX_CATEGORY_LENGTH } from '../../types/Category';

interface AddableCategoryProps {
  targetCategory: Category | null,
  categorySelectionState: CategorySelectionState,
  setCategorySelectionState: (nextState: CategorySelectionState) => void,
  categorySelectionType: CategorySelectionType,
}

export default function AddableCategory({
  targetCategory,
  categorySelectionState,
  setCategorySelectionState,
  categorySelectionType,
}: AddableCategoryProps): JSX.Element {
  const [name, setName] = useState('');
  const { blogId, updateCategories } = useContext(BlogContext);
  const isAddableType = categorySelectionType === 'ADDABLE';
  const isDisabled = !isAddableType && targetCategory; // always enabled on ADDABLE type

  // click event
  const onCategoryClicked = () => {
    if (!isDisabled) {
      setCategorySelectionState('ADDING');
    }
  };

  const onSubmitClicked = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (name.length <= 0 || blogId === undefined) {
      return;
    }

    try {
      await createCategoryAPI(blogId, name);
      setCategorySelectionState('IDLE');
      if (updateCategories) {
        await updateCategories();
      }
    } catch {
      alert('카테고리를 생성하는 과정에서 에러가 발생했습니다.');
    }
  };

  const onCancelClicked = (e: React.MouseEvent) => {
    e.stopPropagation();
    setName('');
    setCategorySelectionState('EDITING');
  };

  const isActive = isAddableType && categorySelectionState === 'ADDING';

  return (
    <Badge
      className={`category_button${isDisabled ? ' disabled' : ''}${isActive ? ' active' : ''}`}
      onClick={onCategoryClicked}
    >
      {categorySelectionState === 'ADDING'
        ? (
          <>
            <input
              type="text"
              value={name}
              maxLength={MAX_CATEGORY_LENGTH}
              onChange={(e) => setName(e.target.value)}
            />
            {categorySelectionType === 'EDITABLE' && (
            <>
              <FiPlusCircle
                className={`icon plus${name.length > 0 ? '' : ' disabled'}`}
                onClick={onSubmitClicked}
              />
              <FiXCircle
                className="icon x"
                onClick={onCancelClicked}
              />
            </>
            )}
          </>
        )
        : 'ADD'}
    </Badge>
  );
}
