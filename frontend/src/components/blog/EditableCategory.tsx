import React, { useState } from 'react';
import { FiPlusCircle, FiXCircle } from 'react-icons/fi';
import { Badge } from 'reactstrap';
import Category, { CategorySelectionState } from '../../types/Category';

interface EditableCategoryProps {
  category: Category,
  categoryToEdit: Category | null,
  setCategoryToEdit: React.Dispatch<React.SetStateAction<Category | null>>,
  categorySelectionState: CategorySelectionState,
  categoriesToEdit: React.MutableRefObject<{[key: number]: Category}>
}

export default function EditableCategory({
  category,
  categoryToEdit,
  setCategoryToEdit,
  categorySelectionState,
  categoriesToEdit,
}: EditableCategoryProps): JSX.Element {
  // editing related
  const [newName, setNewName] = useState(category.name);

  // click event
  const onCategoryClicked = () => {
    if (!categoryToEdit) {
      setCategoryToEdit(category);
    }
  };

  const onApplyClicked = () => {
    setCategoryToEdit(null);

    if (!category.id) {
      return;
    }

    if (category.name === newName) {
      // if newName equals to the original one, remove it from the candidate list
      delete categoriesToEdit.current[category.id];
    } else {
      // else, add it to the candidate list
      categoriesToEdit.current[category.id as number] = { ...category, name: newName };
    }
  };

  const onCancelClicked = () => {
    setCategoryToEdit(null);

    // reset name
    if (category.id && category.id in categoriesToEdit.current) {
      setNewName(categoriesToEdit.current[category.id].name);
    } else {
      setNewName(category.name);
    }
  };

  // set className
  const isEditingThis = categoryToEdit?.id === category.id;

  let className = 'category_button';
  if (categorySelectionState === 'EDITING' && categoryToEdit) {
    className += isEditingThis ? ' editing' : ' disabled';
  }

  return (
    <Badge
      key={`editable_${category.id ?? 0}`}
      className={className}
      onClick={onCategoryClicked}
    >
      {!isEditingThis && newName}
      {isEditingThis && (
      <>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <FiPlusCircle className="icon plus" onClick={onApplyClicked} />
        <FiXCircle className="icon x" onClick={onCancelClicked} />
      </>
      )}
    </Badge>
  );
}
