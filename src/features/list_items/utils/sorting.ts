/**
 * Utilitários de ordenação para items de lista
 */

import { Decimal } from 'decimal.js';
import type { ListItem } from '../types';

export type SortMode = 'default' | 'az' | 'price';

export const sortItemsByDate = (items: ListItem[]): ListItem[] => {
  return [...items].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateA - dateB;
  });
};

export const sortItemsByName = (items: ListItem[]): ListItem[] => {
  return [...items].sort((a, b) => {
    const titleA = (a.title ?? '').trim();
    const titleB = (b.title ?? '').trim();

    return titleA.localeCompare(titleB, 'pt-BR', { sensitivity: 'base' });
  });
};

export const sortItemsByPrice = (items: ListItem[]): ListItem[] => {
  return [...items].sort((a, b) => {
    const priceA = new Decimal(a.price ?? 0);
    const priceB = new Decimal(b.price ?? 0);
    return priceA.comparedTo(priceB);
  });
};

export const sortItems = (items: ListItem[], mode: SortMode): ListItem[] => {
  switch (mode) {
    case 'az':
      return sortItemsByName(items);
    case 'price':
      return sortItemsByPrice(items);
    default:
      return sortItemsByDate(items);
  }
};

export const separateItemsByStatus = (items: ListItem[], mode: SortMode = 'default') => {
  const sorted = sortItems(items, mode);

  return {
    unchecked: sorted.filter((item) => !item.isChecked),
    checked: sorted.filter((item) => item.isChecked),
  };
};
