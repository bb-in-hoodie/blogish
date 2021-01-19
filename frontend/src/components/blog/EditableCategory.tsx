import React, { useContext, useState } from 'react';
import { FiPlusCircle, FiXCircle, FiTrash2 } from 'react-icons/fi';
import { Badge } from 'reactstrap';
import { deleteCategoryAPI, updateCategoryAPI } from '../../api/CategoryAPI';
import BlogContext from '../../contexts/BlogContext';
import Category, { CategorySelectionState, MAX_CATEGORY_LENGTH } from '../../types/Category';

interface EditableCategoryProps {
  category: Category,
  categoryToEdit: Category | null,
  setCategoryToEdit: React.Dispatch<React.SetStateAction<Category | null>>,
  categorySelectionState: CategorySelectionState,
  setCategorySelectionState: (nextState: CategorySelectionState) => void;
}

export default function EditableCategory({
  category,
  categoryToEdit,
  setCategoryToEdit,
  categorySelectionState,
  setCategorySelectionState,
}: EditableCategoryProps): JSX.Element {
  const [newName, setNewName] = useState(category.name);
  const { updateCategories } = useContext(BlogContext);

  // click event
  const onCategoryClicked = () => {
    if (!categoryToEdit) {
      setCategoryToEdit(category);
    }
  };

  const onSubmitClicked = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (newName.length <= 0) {
      return;
    }

    try {
      await updateCategoryAPI(category.id as number, newName);
      setCategoryToEdit(null);
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

    // eslint-disable-next-line no-restricted-globals
    const confirmed = confirm('카테고리를 삭제하면 해당 카테고리의 게시글도 모두 삭제됩니다. 삭제하시겠습니까?');
    if (confirmed) {
      try {
        await deleteCategoryAPI(category.id as number);
        setCategoryToEdit(null);
        setCategorySelectionState('IDLE');
        if (updateCategories) {
          await updateCategories();
        }
      } catch {
        alert('카테고리를 삭제하는 과정에서 에러가 발생했습니다.');
      }
    }
  };

  const onCancelClicked = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCategoryToEdit(null);
    setNewName(category.name);
  };

  // set className
  const isEditingThis = categoryToEdit?.id === category.id;

  let className = 'category_button';
  if (categorySelectionState === 'EDITING' && categoryToEdit) {
    className += isEditingThis ? ' editing' : ' disabled';
  } else if (categorySelectionState === 'ADDING') {
    className += ' disabled';
  }

  return (
    <Badge
      key={`editable_${category.id ?? 0}`}
      className={className}
      onClick={onCategoryClicked}
    >
      {!isEditingThis && (
        <>
          {category.name}
          <FiTrash2
            className="icon delete"
            onClick={onDeleteClicked}
          />
        </>
      )}
      {isEditingThis && (
      <>
        <input
          type="text"
          value={newName}
          maxLength={MAX_CATEGORY_LENGTH}
          onChange={(e) => setNewName(e.target.value)}
        />
        <FiPlusCircle
          className={`icon plus${newName.length > 0 ? '' : ' disabled'}`}
          onClick={onSubmitClicked}
        />
        <FiXCircle
          className="icon x"
          onClick={onCancelClicked}
        />
      </>
      )}
    </Badge>
  );
}
