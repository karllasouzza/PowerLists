import { List } from '@/data/types';

export const filterListsByQuery = (lists: List[], query: string): List[] => {
  let filteredLists: List[] = [];

  if (query.length > 0) {
    filteredLists = lists.filter((list) => list.title.toLowerCase().includes(query.toLowerCase()));
  } else {
    filteredLists = lists;
  }

  return filteredLists.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};
