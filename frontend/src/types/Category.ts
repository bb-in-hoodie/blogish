export default interface Category {
  id?: number,
  name: string,
  blogId?: number
}

export const ALL_CATEGORIES: Category = {
  id: -1,
  name: 'ALL',
};
