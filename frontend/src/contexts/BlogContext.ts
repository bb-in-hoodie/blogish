import React from 'react';

interface BlogContextType {
  blogId?: number,
  updateCategories?: () => Promise<void>,
}

const BlogContext = React.createContext<BlogContextType>({});

export default BlogContext;
