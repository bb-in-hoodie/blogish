import axios from 'axios';
import Blog, { BlogRequestBody } from '../types/Blog';
import Category from '../types/Category';
import Post from '../types/Post';

const url = '/api/blogs';

export function blogsOfUserAPI(userId: string): Promise<Blog[]> {
  return axios.get(`${url}/owner/${userId}`).then((resp) => resp.data);
}

export function blogsOfOthersAPI(userId: string): Promise<Blog[]> {
  return axios.get(`${url}/others/${userId}`).then((resp) => resp.data);
}

export function createBlogAPI(blog: BlogRequestBody): Promise<Blog> {
  return axios.post(`${url}`, blog).then((resp) => resp.data);
}

export function blogInfoAPI(blogId: number): Promise<Blog> {
  return axios.get(`${url}/${blogId}`).then((resp) => resp.data);
}

export function categoriesOfBlogAPI(blogId: number): Promise<Category[]> {
  return axios.get(`${url}/${blogId}/categories`).then((resp) => resp.data);
}

export function postsOfBlogAPI(blogId: number): Promise<Post[]> {
  return axios.get(`${url}/${blogId}/posts`).then((resp) => resp.data);
}

export function createPostAPI(post: Post): Promise<Post> {
  return axios.post(`${url}/${post.blogId}/posts`, post).then((resp) => resp.data);
}

export function createCategoryAPI(blogId: number, name: string): Promise<Category> {
  return axios.post(`${url}/${blogId}/categories`, { name }).then((resp) => resp.data);
}
