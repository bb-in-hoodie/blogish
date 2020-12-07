import axios from 'axios';
import Blog, { BlogRequestBody } from '../types/Blog';
import Category from '../types/Category';

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
