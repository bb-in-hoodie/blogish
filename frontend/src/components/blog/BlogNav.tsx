import React, { useCallback, useEffect, useState } from 'react';
import { Badge, Spinner } from 'reactstrap';
import { format } from 'date-fns';
import { categoriesOfBlogAPI, postsOfBlogAPI } from '../../api/BlogAPI';
import { postsOfCategoryAPI } from '../../api/CategoryAPI';
import Blog from '../../types/Blog';
import Category, { ALL_CATEGORIES } from '../../types/Category';
import Post from '../../types/Post';
import '../../css/components/blognav.css';
import { postInfoAPI } from '../../api/PostAPI';
import Paging from '../common/Paging';

interface BlogNavProps {
  blog: Blog | null,
  selectedPost: Post | null,
  setSelectedPost: React.Dispatch<React.SetStateAction<Post | null>>,
  waitingFetchingPost: boolean,
  setWaitingFetchingPost: React.Dispatch<React.SetStateAction<boolean>>
}

function formatDateTime(currentDay: number, datetime?: string) {
  if (!datetime) {
    return '';
  }

  const date = new Date(`${datetime}Z`);
  return format(date, date.getDay() === currentDay ? 'HH:mm' : 'yyyy.MM.dd');
}

export default function BlogNav({
  blog, selectedPost, setSelectedPost, waitingFetchingPost, setWaitingFetchingPost,
}: BlogNavProps): JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState(ALL_CATEGORIES);
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagedPosts, setPagedPosts] = useState<Post[]>([]);
  const [waitingGettingPosts, setWaitingGettingPosts] = useState(true);
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
    if (!blog) {
      return;
    }

    setPosts([]);
    setWaitingGettingPosts(true);
    if (categoryId === ALL_CATEGORIES) {
      if (blog) {
        setPosts(await postsOfBlogAPI(blog?.id));
      }
    } else {
      setPosts(await postsOfCategoryAPI(categoryId));
    }
    setWaitingGettingPosts(false);
  }, [blog, setPosts, setWaitingGettingPosts]);

  useEffect(() => {
    getPosts(activeCategoryId);
  }, [getPosts, activeCategoryId]);

  // select first post of posts
  const fetchPost = useCallback(async (postId?: number) => {
    if (postId) {
      // initialize
      setSelectedPost(null);
      setWaitingFetchingPost(true);

      // API request
      setSelectedPost(await postInfoAPI(postId));
      setWaitingFetchingPost(false);
    }
  }, [setSelectedPost, setWaitingFetchingPost]);

  const fetchPostOnKeyDown = (code: string, postId?: number) => {
    if (code === 'Enter' || code === 'Space') {
      fetchPost(postId);
    }
  };

  useEffect(() => {
    // fetch the first post if selectedPost is null
    if (posts.length > 0 && !selectedPost && !waitingFetchingPost) {
      fetchPost(posts[0].id);
    }
  }, [posts, fetchPost, selectedPost, waitingFetchingPost]);

  return (
    <nav>
      <section className="category_list">
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
      </section>
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
                  <span className="created_time">{formatDateTime(currentDay, post.createdTime)}</span>
                </li>
              ))}
            </ul>
            <Paging
              data={posts}
              sizeOfPage={4}
              widthOfPaging={5}
              onPageSelected={setPagedPosts}
            />
          </section>
        )
        : (
          <section className="empty_post_list">
            {waitingGettingPosts && <Spinner />}
            {!waitingGettingPosts && (activeCategoryId === ALL_CATEGORIES
              ? <span>아직 작성된 글이 없습니다.</span>
              : <span>이 카테고리에 작성된 글이 없습니다.</span>)}
          </section>
        )}
    </nav>
  );
}
