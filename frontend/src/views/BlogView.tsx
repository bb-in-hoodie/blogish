import React, { useCallback, useEffect, useState } from 'react';
import {
  Redirect,
  Route, Switch, useHistory, useParams, useRouteMatch,
} from 'react-router-dom';
import { blogInfoAPI, categoriesOfBlogAPI, postsOfBlogAPI } from '../api/BlogAPI';
import useUser from '../hooks/useUser';
import Blog, { WriteMode } from '../types/Blog';
import Post from '../types/Post';
import Category, { ALL_CATEGORIES } from '../types/Category';
import BlogNav from '../components/blog/BlogNav';
import PostView from '../components/blog/PostView';
import '../css/blog.css';
import Write from '../components/blog/Write';
import BlogContext from '../contexts/BlogContext';
import { postsOfCategoryAPI } from '../api/CategoryAPI';

export default function BlogView(): JSX.Element {
  const user = useUser(true);
  const history = useHistory();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [waitingFetchingSinglePost, setWaitingFetchingSinglePost] = useState(false);
  const [waitingFetchingPosts, setWaitingFetchingPosts] = useState(true);
  const [writeMode] = useState<WriteMode>('WRITE');
  const { path, url } = useRouteMatch();
  const { blogId } = useParams() as { blogId: string };

  // get blog info
  const updateBlog = async () => {
    setBlog(await blogInfoAPI(parseInt(blogId, 10)));
  };

  const updateCategories = async () => {
    setCategories(await categoriesOfBlogAPI(parseInt(blogId, 10)));
  };

  useEffect(() => {
    if (!blogId) {
      history.push('/browse');
    }

    const updateBlogAndCategories = async () => {
      try {
        await updateBlog();
        await updateCategories();
      } catch (e) {
        alert('블로그 정보를 불러오는데 실패했습니다.');
        history.push('/browse');
      }
    };
    updateBlogAndCategories();
  }, [blogId, history]);

  // fetch posts on category change
  const getPosts = useCallback(async (category: Category = activeCategory) => {
    if (!blog || !setPosts) {
      return;
    }

    setPosts([]);
    setWaitingFetchingPosts(true);
    if (category.id === ALL_CATEGORIES.id) {
      if (blog) {
        setPosts(await postsOfBlogAPI(blog?.id));
      }
    } else if (category.id) {
      setPosts(await postsOfCategoryAPI(category.id));
    }
    setWaitingFetchingPosts(false);
  }, [blog, activeCategory, setPosts, setWaitingFetchingPosts]);

  // context
  const blogContext = {
    user,
    blog,
    updateCategories,
    setActiveCategory,
    setSelectedPost,
    posts,
    setPosts,
    getPosts,
  };

  return (
    <BlogContext.Provider value={blogContext}>
      <div className="blog">
        <header className="main_header">
          <div className="user_info">
            { user.nickname }
          </div>
          <div className="blog_info">
            <h2>{ blog?.title }</h2>
            {blog?.description && <h5 className="description">{ blog?.description }</h5>}
            {blog?.owner.nickname && (
            <span className="nickname">
              @
              { blog?.owner.nickname }
            </span>
          )}
          </div>
        </header>

        <Switch>
          <Route exact strict path={path}>
            <BlogNav
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              selectedPost={selectedPost}
              setSelectedPost={setSelectedPost}
              waitingFetchingSinglePost={waitingFetchingSinglePost}
              setWaitingFetchingSinglePost={setWaitingFetchingSinglePost}
              waitingFetchingPosts={waitingFetchingPosts}
            />
            <PostView selectedPost={selectedPost} waitingFetchingSinglePost={waitingFetchingSinglePost} />
          </Route>
          <Route exact path={`${path}/post`}>
            <Write
              mode={writeMode}
              categories={categories}
              initialCategory={activeCategory}
              selectedPost={selectedPost}
            />
          </Route>
          <Route path={path}>
            <Redirect to={url.replace(/(.*)\/$/, '$1')} />
          </Route>
        </Switch>
      </div>
    </BlogContext.Provider>
  );
}
