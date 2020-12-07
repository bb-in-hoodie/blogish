import React, { useEffect, useState } from 'react';
import { Badge } from 'reactstrap';
import { categoriesOfBlogAPI } from '../../api/BlogAPI';
import Blog from '../../types/Blog';
import Category, { ALL_CATEGORIES } from '../../types/Category';
import '../../css/components/blognav.css';

interface BlogNavProps {
  blog: Blog | null
}

export default function BlogNav({ blog }: BlogNavProps): JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState(ALL_CATEGORIES);

  // fetch categories on blog change
  useEffect(() => {
    async function getCategories(blogId: number) {
      setCategories(await categoriesOfBlogAPI(blogId));
    }

    if (blog) {
      getCategories(blog.id);
    }
  }, [blog]);

  return (
    <nav>
      <div className="category_list">
        <Badge
          className={activeCategoryId === ALL_CATEGORIES ? 'active' : ''}
          color="primary"
          onClick={() => setActiveCategoryId(ALL_CATEGORIES)}
        >
          ALL
        </Badge>
        {categories.map((category) => (
          <Badge
            className={activeCategoryId === category.id ? 'active' : ''}
            color="secondary"
            onClick={() => setActiveCategoryId(category.id as number)}
          >
            {category.name}
          </Badge>
        ))}
      </div>
      <div className="post_list">
        <ul>
          <li className="hover">
            <span className="title">the very first movie I&apos;ve watched</span>
            <span className="created_time">2020.05.14 13:10</span>
          </li>
          <li>
            <span className="title">It&apos;s good to go outside</span>
            <span className="created_time">2020.05.05 18:11</span>
          </li>
          <li>
            <span className="title">What a sunny day</span>
            <span className="created_time">2020.02.14 09:30</span>
          </li>
        </ul>
        {/* paging component */}
      </div>
    </nav>
  );
}
