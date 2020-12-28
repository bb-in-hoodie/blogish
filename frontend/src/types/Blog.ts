import User from './User';

export interface BlogRequestBody {
  title: string;
  description: string;
  userId: string;
}

export default interface Blog {
  id: number;
  title: string;
  description: string;
  createdTime: string;
  owner: User;
}

export type WriteMode = 'WRITE' | 'EDIT';
