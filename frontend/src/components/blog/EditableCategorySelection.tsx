import React, { useState } from 'react';
import { Badge } from 'reactstrap';
import { FiSettings, FiX } from 'react-icons/fi';
import Category, { ALL_CATEGORIES, CategorySelectionState, CategorySelectionType } from '../../types/Category';
import '../../css/components/categoryselection.css';
import EditableCategory from './EditableCategory';
import AddableCategory from './AddableCategory';

interface CategorySelectionProps {
  categories: Category[],
  activeCategory: Category | null,
  setActiveCategory: React.Dispatch<React.SetStateAction<Category>>,
  categorySelectionType: CategorySelectionType
}

export default function EditableCategorySelection({
  categories,
  activeCategory,
  setActiveCategory,
  categorySelectionType,
}: CategorySelectionProps): JSX.Element {
  const [curState, setCurState] = useState<CategorySelectionState>('IDLE'); // IDLE | EDITING | ADDING
  const [targetCategory, setTargetCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  const setCategorySelectionState = (nextState: CategorySelectionState) => {
    setCurState(nextState);
    setTargetCategory(null);
  };

  return (
    <section className="category_selection">
      {curState === 'IDLE' && (
        <>
          <Badge
            className={`all_button${activeCategory?.id === ALL_CATEGORIES.id ? ' active' : ''}`}
            onClick={() => setActiveCategory(ALL_CATEGORIES)}
          >
            {ALL_CATEGORIES.name}
          </Badge>

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
                    targetCategory={targetCategory}
                    setTargetCategory={setTargetCategory}
                    categorySelectionState={curState}
                    setCategorySelectionState={setCurState}
                  />
                ))}
                <AddableCategory
                  targetCategory={targetCategory}
                  categorySelectionType={categorySelectionType}
                  categorySelectionState={curState}
                  setCategorySelectionState={setCurState}
                  newCategoryName={newCategoryName}
                  setNewCategoryName={setNewCategoryName}
                />
                <FiX className="icon x" onClick={() => setCategorySelectionState('IDLE')} />
              </>
              )}
        </>
      )}
    </section>
  );
}
