/**
 * Utilitários de ordenação para items de lista
 */

import type { ListItem } from '../types';

/**
 * Ordena items por data de criação (mais antigos primeiro)
 *
 * @param items - Array de items a serem ordenados
 * @returns Array ordenado
 */
export const sortItemsByDate = (items: ListItem[]): ListItem[] => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.createdAt!).getTime();
    const dateB = new Date(b.createdAt!).getTime();
    return dateA - dateB;
  });
};

/**
 * Separa items em checked e unchecked, mantendo ordenação por data
 *
 * @param items - Array de items
 * @returns Objeto com items separados
 */
export const separateItemsByStatus = (items: ListItem[]) => {
  const sorted = sortItemsByDate(items);

  return {
    unchecked: sorted.filter((item) => !item.status),
    checked: sorted.filter((item) => item.status),
  };
};
