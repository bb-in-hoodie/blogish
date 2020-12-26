import React from 'react';
import { Badge } from 'reactstrap';
import Category, { ALL_CATEGORIES } from '../../types/Category';
import '../../css/components/categoryselection.css';

interface CategorySelectionProps {
  categories: Category[],
  activeCategory: Category | null,
  setActiveCategory: React.Dispatch<React.SetStateAction<Category>>,
  enableAllCategories: boolean
}

export default function CategorySelection({
  categories, activeCategory, setActiveCategory, enableAllCategories,
}: CategorySelectionProps): JSX.Element {
  return (
    <section className="category_selection">
      {enableAllCategories
      && (
      <Badge
        className={activeCategory?.id === ALL_CATEGORIES.id ? 'active' : ''}
        color="primary"
        onClick={() => setActiveCategory(ALL_CATEGORIES)}
      >
        {ALL_CATEGORIES.name}
      </Badge>
      )}
      {categories.map((category) => (
        <Badge
          key={category.id ?? 0}
          className={activeCategory?.id === category.id ? 'active' : ''}
          color="secondary"
          onClick={() => setActiveCategory(category)}
        >
          {category.name}
        </Badge>
      ))}
    </section>
  );
}
