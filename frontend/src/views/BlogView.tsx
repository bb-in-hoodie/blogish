import React, { useEffect, useState } from 'react';
import {
  Redirect,
  Route, Switch, useHistory, useParams, useRouteMatch,
} from 'react-router-dom';
import { blogInfoAPI } from '../api/BlogAPI';
import useUser from '../hooks/useUser';
import Blog from '../types/Blog';
import Post from '../types/Post';
import BlogNav from '../components/blog/BlogNav';
import PostView from '../components/blog/PostView';
import '../css/blog.css';
import Write from '../components/blog/Write';

export default function BlogView(): JSX.Element {
  const user = useUser(true);
  const history = useHistory();
  const { blogId } = useParams() as { blogId: string };
  const [blog, setBlog] = useState<Blog | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [waitingFetchingPost, setWaitingFetchingPost] = useState(false);
  const { path, url } = useRouteMatch();

  useEffect(() => {
    if (!blogId) {
      history.push('/browse');
    }

    async function updateBlog() {
      try {
        const blogInfo = await blogInfoAPI(parseInt(blogId, 10));
        setBlog(blogInfo);
      } catch (e) {
        alert('블로그를 불러오는데 실패했습니다.');
        history.push('/browse');
      }
    }
    updateBlog();
  }, [blogId, history]);

  return (
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
            user={user}
            blog={blog}
            selectedPost={selectedPost}
            setSelectedPost={setSelectedPost}
            waitingFetchingPost={waitingFetchingPost}
            setWaitingFetchingPost={setWaitingFetchingPost}
          />
          <PostView selectedPost={selectedPost} waitingFetchingPost={waitingFetchingPost} />
        </Route>
        <Route exact path={`${path}/post`}>
          <Write />
        </Route>
        <Route path={path}>
          <Redirect to={url.replace(/(.*)\/$/, '$1')} />
        </Route>
      </Switch>
    </div>
  );
}
