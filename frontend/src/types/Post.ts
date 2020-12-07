export default interface Post {
  id?: number;
  blogId: number;
  title: string;
  content?: string;
  createdTime?: string;
  updateTime?: string;
  categoryId: number;
}
