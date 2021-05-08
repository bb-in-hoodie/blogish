import React from 'react';
import Blog from '../types/Blog';
import Category from '../types/Category';
import Post from '../types/Post';
import User from '../types/User';

interface BlogContextType {
  user?: User,
  blog?: Blog | null,
  updateBlog?: () => Promise<void>,
  updateCategories?: () => Promise<void>,
  setActiveCategory?: React.Dispatch<React.SetStateAction<Category>>,
  posts: Post[],
  setPosts?: React.Dispatch<React.SetStateAction<Post[]>>,
  getPosts?: (category?: Category) => Promise<void>,
  selectedPost?: Post | null,
  setSelectedPost?: React.Dispatch<React.SetStateAction<Post | null>>
}

const BlogContext = React.createContext<BlogContextType>({ posts: [] });

export default BlogContext;
