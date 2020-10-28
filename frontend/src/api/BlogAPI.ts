import axios from 'axios';
import Blog from '../types/Blog';

const url = '/api/blogs';

export function blogsOfUserAPI(userId: string): Promise<Blog[]> {
  return axios.get(`${url}/owner/${userId}`).then((resp) => resp.data);
}

export function blogsOfOthersAPI(userId: string): Promise<Blog[]> {
  return axios.get(`${url}/others/${userId}`).then((resp) => resp.data);
}
