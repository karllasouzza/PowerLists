import { List } from '../types';

export const filterListsByQuery = (lists: List[], query: string): List[] => {
  if (query.length === 0) return [];
  
  return lists.filter((list) =>
    list.title.toLowerCase().includes(query.toLowerCase())
  );
};
