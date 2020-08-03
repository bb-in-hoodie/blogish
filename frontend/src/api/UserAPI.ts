import axios from 'axios';
import User from '../types/User';

const url = '/api';

export function userJoin(user: User) {
  return axios.post(`${url}/users`, user).then((resp) => resp.data);
}
