import React, {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import { Button, Spinner } from 'reactstrap';
import { format, isSameDay } from 'date-fns';
import { ImPen } from 'react-icons/im';
import { useHistory, useRouteMatch } from 'react-router-dom';
import BlogContext from '../../contexts/BlogContext';
import { postInfoAPI } from '../../api/PostAPI';
import Category, { ALL_CATEGORIES } from '../../types/Category';
import Post from '../../types/Post';
import Paging from '../common/Paging';
import EditableCategorySelection from './EditableCategorySelection';
import '../../css/components/blognav.css';

interface BlogNavProps {
  categories: Category[],
  activeCategory: Category,
  setActiveCategory: React.Dispatch<React.SetStateAction<Category>>,
  waitingFetchingSinglePost: boolean,
  setWaitingFetchingSinglePost: React.Dispatch<React.SetStateAction<boolean>>,
  waitingFetchingPosts: boolean,
}

function formatDateTime(currentDate: React.MutableRefObject<Date>, datetime?: string) {
  if (!datetime) {
    return '';
  }

  const date = new Date(`${datetime}Z`);
  return format(date, isSameDay(currentDate.current, date) ? 'HH:mm' : 'yyyy.MM.dd');
}

export default function BlogNav({
  categories,
  activeCategory,
  setActiveCategory,
  waitingFetchingSinglePost,
  setWaitingFetchingSinglePost,
  waitingFetchingPosts,
}: BlogNavProps): JSX.Element {
  const {
    user, blog, posts, getPosts, selectedPost, setSelectedPost,
  } = useContext(BlogContext);
  const [pagedPosts, setPagedPosts] = useState<Post[]>([]);
  const currentDate = useRef(new Date());
  const { url } = useRouteMatch();
  const history = useHistory();

  useEffect(() => {
    if (getPosts) {
      getPosts();
    }
  }, [getPosts, activeCategory]);

  // select first post of posts
  const fetchPost = useCallback(async (postId?: number) => {
    if (postId && setSelectedPost) {
      // initialize
      setSelectedPost(null);
      setWaitingFetchingSinglePost(true);

      // API request
      setSelectedPost(await postInfoAPI(postId));
      setWaitingFetchingSinglePost(false);
    }
  }, [setSelectedPost, setWaitingFetchingSinglePost]);

  const fetchPostOnKeyDown = (code: string, postId?: number) => {
    if (code === 'Enter' || code === 'Space') {
      fetchPost(postId);
    }
  };

  useEffect(() => {
    // fetch the first post if selectedPost is null
    if (posts.length > 0 && !selectedPost && !waitingFetchingSinglePost) {
      fetchPost(posts[0].id);
    }
  }, [posts, fetchPost, selectedPost, waitingFetchingSinglePost]);

  // write button
  const onWriteClicked = () => {
    history.push(`${url}/post`);
  };

  return (
    <nav>
      <EditableCategorySelection
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categorySelectionType={user?.userId === blog?.owner.userId ? 'EDITABLE' : 'READONLY'}
      />
      {posts.length > 0
        ? (
          <section className="post_list">
            <ul>
              {pagedPosts.map((post) => (
                <li
                  key={post.id ?? 0}
                  role="menuitem"
                  className={`${selectedPost?.id === post.id ? 'selected' : ''}`}
                  onClick={() => fetchPost(post.id)}
                  onKeyDown={(e) => fetchPostOnKeyDown(e.nativeEvent.code, post.id)}
                >
                  <span className="title">{post.title}</span>
                  <span className="created_time">{formatDateTime(currentDate, post.createdTime)}</span>
                </li>
              ))}
            </ul>
            <Paging
              data={posts}
              sizeOfPage={5}
              widthOfPaging={5}
              onPageSelected={setPagedPosts}
            />
          </section>
        )
        : (
          <section className="empty_post_list">
            {waitingFetchingPosts && <Spinner />}
            {!waitingFetchingPosts && (activeCategory.id === ALL_CATEGORIES.id
              ? <span>아직 작성된 글이 없습니다.</span>
              : <span>이 카테고리에 작성된 글이 없습니다.</span>)}
          </section>
        )}
      {user?.userId === blog?.owner.userId
        && <Button className="post_button" onClick={onWriteClicked}><ImPen /></Button>}
    </nav>
  );
}
