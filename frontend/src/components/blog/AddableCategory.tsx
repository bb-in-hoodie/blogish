import React, { useContext, useState } from 'react';
import { FiPlusCircle, FiXCircle } from 'react-icons/fi';
import { Badge } from 'reactstrap';
import BlogContext from '../../contexts/BlogContext';
import Category, { CategorySelectionState } from '../../types/Category';

interface AddableCategoryProps {
  categoryToEdit: Category | null,
  categorySelectionState: CategorySelectionState,
  setCategorySelectionState: (nextState: CategorySelectionState) => void;
}

export default function AddableCategory({
  categoryToEdit,
  categorySelectionState,
  setCategorySelectionState,
}: AddableCategoryProps): JSX.Element {
  const [name, setName] = useState('');
  const { updateCategories } = useContext(BlogContext);

  // click event
  const onCategoryClicked = () => {
    setCategorySelectionState('ADDING');
  };

  const onSubmitClicked = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (name.length <= 0) {
      return;
    }

    // TODO: API call
    setCategorySelectionState('IDLE');
    if (updateCategories) {
      updateCategories();
    }
  };

  const onCancelClicked = (e: React.MouseEvent) => {
    e.stopPropagation();
    setName('');
    setCategorySelectionState('EDITING');
  };

  return (
    <Badge
      className={`category_button${categoryToEdit ? ' disabled' : ''}`}
      onClick={onCategoryClicked}
    >
      {categorySelectionState === 'ADDING'
        ? (
          <>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <FiPlusCircle
              className={`icon plus${name.length > 0 ? '' : ' disabled'}`}
              onClick={onSubmitClicked}
            />
            <FiXCircle
              className="icon x"
              onClick={onCancelClicked}
            />
          </>
        )
        : 'ADD'}
    </Badge>
  );
}
