import axios from 'axios';
import Post from '../types/Post';

const url = '/api/posts';

export function postInfoAPI(postId: number): Promise<Post> {
  return axios.get(`${url}/${postId}`).then((resp) => resp.data);
}

export function deletePostAPI(postId: number): Promise<number> {
  return axios.delete(`${url}/${postId}`).then((resp) => resp.data);
}
