import axios from 'axios';
import User from '../types/User';

const url = '/api';

export function userJoin(user: User): Promise<any> {
  return axios.post(`${url}/users`, user).then((resp) => resp.data);
}

export function userValidate(userId: string): Promise<any> {
  return axios.get(`${url}/users/validate`, { params: { userId } }).then((resp) => resp.data);
}
