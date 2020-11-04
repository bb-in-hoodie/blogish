import axios from 'axios';
import User, { LoginResult } from '../types/User';

const url = '/api/users';

export function joinAPI(user: User): Promise<any> {
  return axios.post(`${url}`, user).then((resp) => resp.data);
}

export function idValidateAPI(userId: string): Promise<boolean> {
  return axios.get(`${url}/validate`, { params: { userId } }).then((resp) => resp.data);
}

export function sessionAPI(): Promise<LoginResult> {
  return axios.get(`${url}/session`).then((resp) => resp.data);
}

export function loginAPI(userId: string, password: string): Promise<LoginResult> {
  return axios.post(`${url}/login`, { userId, password }).then((resp) => resp.data);
}
