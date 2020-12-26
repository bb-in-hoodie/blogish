import React from 'react';
import { Badge } from 'reactstrap';
import Category, { ALL_CATEGORIES } from '../../types/Category';
import '../../css/components/categoryselection.css';

interface CategorySelectionProps {
  categories: Category[],
  activeCategoryId: number,
  setActiveCategoryId: React.Dispatch<React.SetStateAction<number>>,
}

export default function CategorySelection({
  categories, activeCategoryId, setActiveCategoryId,
}: CategorySelectionProps): JSX.Element {
  return (
    <section className="category_selection">
      <Badge
        className={activeCategoryId === ALL_CATEGORIES ? 'active' : ''}
        color="primary"
        onClick={() => setActiveCategoryId(ALL_CATEGORIES)}
      >
        ALL
      </Badge>
      {categories.map((category) => (
        <Badge
          key={category.id ?? 0}
          className={activeCategoryId === category.id ? 'active' : ''}
          color="secondary"
          onClick={() => setActiveCategoryId(category.id as number)}
        >
          {category.name}
        </Badge>
      ))}
    </section>
  );
}
