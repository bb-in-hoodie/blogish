import React, { useEffect, useState } from 'react';
import { Badge } from 'reactstrap';
import { FiSettings, FiXCircle } from 'react-icons/fi';
import Category, { ALL_CATEGORIES, CategorySelectionState, CategorySelectionType } from '../../types/Category';
import '../../css/components/categoryselection.css';
import EditableCategory from './EditableCategory';
import AddableCategory from './AddableCategory';

interface CategorySelectionProps {
  categories: Category[],
  activeCategory: Category | null,
  setActiveCategory: React.Dispatch<React.SetStateAction<Category>>,
  enableAllCategories: boolean,
  categorySelectionType: CategorySelectionType,
}

export default function CategorySelection({
  categories,
  activeCategory,
  setActiveCategory,
  enableAllCategories,
  categorySelectionType,
}: CategorySelectionProps): JSX.Element {
  const [curState, setCurState] = useState<CategorySelectionState>('IDLE');
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  const setCategorySelectionState = (nextState: CategorySelectionState) => {
    setCurState(nextState);
    setCategoryToEdit(null);
  };

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
        {curState === 'IDLE' && <FiSettings className="icon" onClick={() => setCategorySelectionState('EDITING')} />}
        {curState !== 'IDLE'
            && (
            <>
              {categories.map((category) => (
                <EditableCategory
                  key={category.id ?? 0}
                  category={category}
                  categoryToEdit={categoryToEdit}
                  setCategoryToEdit={setCategoryToEdit}
                  categorySelectionState={curState}
                  setCategorySelectionState={setCurState}
                />
              ))}
              <AddableCategory
                categoryToEdit={categoryToEdit}
                categorySelectionState={curState}
                setCategorySelectionState={setCurState}
              />
              <FiXCircle className="icon x" onClick={() => setCategorySelectionState('IDLE')} />
            </>
            )}
      </>
      )}

      {categorySelectionType === 'ADDABLE' && <Badge className="category_button">Add</Badge>}
    </section>
  );
}
