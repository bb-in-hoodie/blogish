export default interface Post {
  id?: number;
  blogId: number;
  title: string;
  content?: string;
  createdTime?: string;
  updatedTime?: string;
  categoryId: number;
}
