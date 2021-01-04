import React, { useRef, useState } from 'react';
import { Badge } from 'reactstrap';
import {
  FiCheckCircle,
  FiPlusCircle, FiSettings, FiXCircle,
} from 'react-icons/fi';
import Category, { ALL_CATEGORIES, CategorySelectionState, CategorySelectionType } from '../../types/Category';
import '../../css/components/categoryselection.css';
import EditableCategory from './EditableCategory';

interface CategorySelectionProps {
  categories: Category[],
  activeCategory: Category | null,
  setActiveCategory: React.Dispatch<React.SetStateAction<Category>>,
  enableAllCategories: boolean,
  categorySelectionType: CategorySelectionType
}

export default function CategorySelection({
  categories, activeCategory, setActiveCategory, enableAllCategories, categorySelectionType,
}: CategorySelectionProps): JSX.Element {
  const [curState, setCurState] = useState<CategorySelectionState>('IDLE');
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const categoriesToEdit = useRef<{[key: number]: Category}>({});

  const setCategorySelectionState = (nextState: CategorySelectionState) => {
    setCurState(nextState);
    setCategoryToEdit(null);
    categoriesToEdit.current = {};
  };

  const categoriesToEditExist = Object.keys(categoriesToEdit.current).length > 0;

  return (
    <section className="category_selection">
      {curState === 'IDLE' && (
        <>
          {enableAllCategories && (
            <Badge
              className={`all_button${activeCategory?.id === ALL_CATEGORIES.id ? ' active' : ''}`}
              onClick={() => setActiveCategory(ALL_CATEGORIES)}
            >
              {ALL_CATEGORIES.name}
            </Badge>
          )}

          {categories.map((category) => (
            <Badge
              key={category.id ?? 0}
              className={`category_button${activeCategory?.id === category.id ? ' active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category.name}
            </Badge>
          ))}
        </>
      )}

      {categorySelectionType === 'EDITABLE'
      && (
      <>
        {curState === 'IDLE'
          ? <FiSettings className="icon" onClick={() => setCategorySelectionState('EDITING')} />
          : categories.map((category) => (
            <EditableCategory
              key={category.id ?? 0}
              category={category}
              categoryToEdit={categoryToEdit}
              setCategoryToEdit={setCategoryToEdit}
              categorySelectionState={curState}
              categoriesToEdit={categoriesToEdit}
            />
          ))}
        {curState === 'EDITING' && (
          <>
            {!categoryToEdit && <FiPlusCircle className="icon plus" onClick={() => setCategorySelectionState('ADDING')} />}
            {categoriesToEditExist && <FiCheckCircle className="icon check" />}
            <FiXCircle className="icon x" onClick={() => setCategorySelectionState('IDLE')} />
          </>
        )}
        {curState === 'ADDING' && (
          <Badge className="category_button">
            ADD
            <FiPlusCircle className="icon plus" />
            <FiXCircle className="icon x" onClick={() => setCategorySelectionState('EDITING')} />
          </Badge>
        )}
      </>
      )}

      {categorySelectionType === 'ADDABLE' && <Badge className="category_button">Add</Badge>}
    </section>
  );
}
