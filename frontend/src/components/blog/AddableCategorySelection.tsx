import React, { useState } from 'react';
import { Badge } from 'reactstrap';
import Category, { CategorySelectionState } from '../../types/Category';
import '../../css/components/categoryselection.css';
import AddableCategory from './AddableCategory';

interface CategorySelectionProps {
  categories: Category[],
  activeCategory: Category | null,
  setActiveCategory: React.Dispatch<React.SetStateAction<Category>>
}

export default function AddableCategorySelection({
  categories,
  activeCategory,
  setActiveCategory,
}: CategorySelectionProps): JSX.Element {
  const [curState, setCurState] = useState<CategorySelectionState>('IDLE');

  return (
    <section className="category_selection">
      {categories.map((category) => (
        <Badge
          key={category.id ?? 0}
          className={`category_button${activeCategory?.id === category.id ? ' active' : ''}`}
          onClick={() => setActiveCategory(category)}
        >
          {category.name}
        </Badge>
      ))}

      <AddableCategory
        targetCategory={activeCategory}
        categorySelectionState={curState}
        setCategorySelectionState={setCurState}
        categorySelectionType="ADDABLE"
      />
    </section>
  );
}
