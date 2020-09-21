import User from './User';

export default interface Blog {
  title: string;
  description: string;
  blogId: string;
  user?: User;
}
