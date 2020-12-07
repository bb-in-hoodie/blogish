import axios from 'axios';
import Post from '../types/Post';

const url = '/api/categories';

export function postsOfCategoryAPI(categoryId: number): Promise<Post[]> {
  return axios.get(`${url}/${categoryId}/posts`).then((resp) => resp.data);
}
