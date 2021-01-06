import React from 'react';

interface BlogContextType {
  updateCategories?: () => Promise<void>
}

const BlogContext = React.createContext<BlogContextType>({});

export default BlogContext;
