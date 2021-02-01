import React from 'react';
import Blog from '../types/Blog';
import Category from '../types/Category';
import Post from '../types/Post';
import User from '../types/User';

interface BlogContextType {
  user?: User,
  blog?: Blog | null,
  updateCategories?: () => Promise<void>,
  setActiveCategory?: React.Dispatch<React.SetStateAction<Category>>,
  setSelectedPost?: React.Dispatch<React.SetStateAction<Post | null>>,
  posts: Post[],
  setPosts?: React.Dispatch<React.SetStateAction<Post[]>>,
  getPosts?: (category?: Category) => Promise<void>
}

const BlogContext = React.createContext<BlogContextType>({ posts: [] });

export default BlogContext;
