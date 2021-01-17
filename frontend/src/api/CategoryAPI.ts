import axios from 'axios';
import Post from '../types/Post';

const url = '/api/categories';

export function postsOfCategoryAPI(categoryId: number): Promise<Post[]> {
  return axios.get(`${url}/${categoryId}/posts`).then((resp) => resp.data);
}

export function updateCategoryAPI(categoryId: number, name: string): Promise<Post[]> {
  return axios.patch(`${url}/${categoryId}`, { name }).then((resp) => resp.data);
}
