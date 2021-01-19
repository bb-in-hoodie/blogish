import axios from 'axios';
import Category from '../types/Category';
import Post from '../types/Post';

const url = '/api/categories';

export function postsOfCategoryAPI(categoryId: number): Promise<Post[]> {
  return axios.get(`${url}/${categoryId}/posts`).then((resp) => resp.data);
}

export function updateCategoryAPI(categoryId: number, name: string): Promise<Category> {
  return axios.patch(`${url}/${categoryId}`, { name }).then((resp) => resp.data);
}

export function deleteCategoryAPI(categoryId: number): Promise<Category> {
  return axios.delete(`${url}/${categoryId}`).then((resp) => resp.data);
}
