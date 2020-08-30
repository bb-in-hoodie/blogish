import axios from 'axios';
import User, { LoginResult } from '../types/User';

const url = '/api';

export function joinAPI(user: User): Promise<any> {
  return axios.post(`${url}/users`, user).then((resp) => resp.data);
}

export function idValidateAPI(userId: string): Promise<boolean> {
  return axios.get(`${url}/users/validate`, { params: { userId } }).then((resp) => resp.data);
}

export function sessionAPI(): Promise<LoginResult> {
  return axios.get(`${url}/users/session`).then((resp) => resp.data);
}

export function loginAPI(userId: string, password: string): Promise<LoginResult> {
  return axios.post(`${url}/users/login`, { userId, password }).then((resp) => resp.data);
}
