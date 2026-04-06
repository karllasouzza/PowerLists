import { List } from '@/data/types';

export const filterListsByQuery = (lists: List[], query: string): List[] => {
  const normalizedQuery = query.trim().toLowerCase();

  const filteredLists = normalizedQuery
    ? lists.filter((list) => list.title.toLowerCase().includes(normalizedQuery))
    : lists;

  return [...filteredLists].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};
