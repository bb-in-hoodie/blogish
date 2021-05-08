import React from 'react';
import { Badge } from 'reactstrap';
import Category, { CategorySelectionState } from '../../types/Category';
import '../../css/components/categoryselection.css';
import AddableCategory from './AddableCategory';

interface CategorySelectionProps {
  categories: Category[],
  activeCategory: Category | null,
  setActiveCategory: React.Dispatch<React.SetStateAction<Category>>,
  newCategoryName: string,
  setNewCategoryName: React.Dispatch<React.SetStateAction<string>>,
  curState: CategorySelectionState,
  setCurState: React.Dispatch<React.SetStateAction<CategorySelectionState>>,
}

export default function AddableCategorySelection({
  categories,
  activeCategory,
  setActiveCategory,
  newCategoryName,
  setNewCategoryName,
  curState,
  setCurState,
}: CategorySelectionProps): JSX.Element {
  const getIsActive = (category: Category) => (activeCategory?.id === category.id && curState !== 'ADDING');

  const onCategoryClicked = (category: Category) => {
    setActiveCategory(category);
    setCurState('IDLE');
  };

  return (
    <section className="category_selection">
      {categories.map((category) => (
        <Badge
          key={category.id ?? 0}
          className={`category_button${getIsActive(category) ? ' active' : ''}`}
          onClick={() => onCategoryClicked(category)}
        >
          {category.name}
        </Badge>
      ))}

      <AddableCategory
        targetCategory={activeCategory}
        categorySelectionState={curState}
        setCategorySelectionState={setCurState}
        categorySelectionType="ADDABLE"
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
      />
    </section>
  );
}
