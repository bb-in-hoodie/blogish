import React from 'react';
import Category from '../types/Category';
import Post from '../types/Post';

interface BlogContextType {
  blogId?: number,
  updateCategories?: () => Promise<void>,
  setActiveCategory?: React.Dispatch<React.SetStateAction<Category>>,
  setSelectedPost?: React.Dispatch<React.SetStateAction<Post | null>>
}

const BlogContext = React.createContext<BlogContextType>({});

export default BlogContext;
