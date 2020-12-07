import React, { useCallback, useEffect, useState } from 'react';
import { Badge } from 'reactstrap';
import { format } from 'date-fns';
import ko from 'date-fns/locale/ko';
import { categoriesOfBlogAPI, postsOfBlogAPI } from '../../api/BlogAPI';
import { postsOfCategoryAPI } from '../../api/CategoryAPI';
import Blog from '../../types/Blog';
import Category, { ALL_CATEGORIES } from '../../types/Category';
import Post from '../../types/Post';
import '../../css/components/blognav.css';

interface BlogNavProps {
  blog: Blog | null
}

function formatDateTime(currentDay: number, datetime?: string) {
  if (!datetime) {
    return '';
  }

  const date = new Date(`${datetime}Z`);
  return format(date, date.getDay() === currentDay ? 'HH:mm' : 'yyyy.MM.dd', { });
}

export default function BlogNav({ blog }: BlogNavProps): JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState(ALL_CATEGORIES);
  const [posts, setPosts] = useState<Post[]>([]);
  const currentDay = (new Date()).getDay();

  // fetch categories on blog change
  const getCategories = useCallback(async (blogId: number) => {
    setCategories(await categoriesOfBlogAPI(blogId));
  }, [setCategories]);

  useEffect(() => {
    if (blog) {
      getCategories(blog.id);
    }
  }, [getCategories, blog]);

  // fetch posts on category change
  const getPosts = useCallback(async (categoryId: number) => {
    if (categoryId === ALL_CATEGORIES) {
      if (blog) {
        setPosts(await postsOfBlogAPI(blog?.id));
      }
    } else {
      setPosts(await postsOfCategoryAPI(categoryId));
    }
  }, [blog, setPosts]);

  useEffect(() => {
    getPosts(activeCategoryId);
  }, [getPosts, activeCategoryId]);

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
            key={category.id ?? 0}
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
          {posts.map((post) => (
            <li key={post.id ?? 0} className="hover">
              <span className="title">{post.title}</span>
              <span className="created_time">{formatDateTime(currentDay, post.createdTime)}</span>
            </li>
          ))}
        </ul>
        {/* paging component */}
      </div>
    </nav>
  );
}
