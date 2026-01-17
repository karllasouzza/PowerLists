import { List } from '../types';

export const transformListForDisplay = (list: any, themeBackground: string): List => {
  return {
    ...list,
    background: themeBackground || '#fff',
    accentColor: list.accentColor,
    color: list.accentColor,
    iconBackground: '#fff',
  };
};
