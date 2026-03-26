import { useCallback, useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useValue } from '@legendapp/state/react';

import { themes } from '@/context/themes/theme-config';
import { useTheme } from '@/context/themes';
import { lists$ } from '@/data/states/lists';
import { listItems$, toggleCheckListItem } from '@/data/states/list-items';
import { List } from '@/data/types';
import { convertFromSupabaseFormat } from '@/lib/supabase/utils';

import { calculateTotal, separateItemsByStatus } from '../utils';
import type { ListItem } from '../types';

export const useListItemsPageLogics = () => {
  const { id: listId } = useLocalSearchParams<{ id: string }>();
  const { theme, colorScheme } = useTheme();

  const lists = useValue(lists$ || {});
  const listsFormated = convertFromSupabaseFormat(Object.values(lists || {})) as List[];
  const currentList = listsFormated.find((list) => list.id === listId);

  const listItemsRaw = useValue(listItems$);
  const items = useMemo(() => {
    const allItems = convertFromSupabaseFormat(Object.values(listItemsRaw || {})) as ListItem[];
    return allItems.filter((item) => item.listId === listId);
  }, [listItemsRaw, listId]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isUpdateOpen, setUpdateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string>();

  const handleToggleCheck = useCallback(async (id: string, currentStatus: boolean) => {
    try {
      await toggleCheckListItem({ id, isChecked: !currentStatus });
    } catch (error) {
      console.error('[ListItemsScreen] Error toggling item check:', error);
    }
  }, []);

  const handleOpenAdd = useCallback(() => {
    setCreateOpen(true);
  }, []);

  const handleOpenUpdate = useCallback((itemId: string) => {
    setActiveItemId(itemId);
    setUpdateOpen(true);
  }, []);

  const handleOpenDelete = useCallback((itemId: string) => {
    setActiveItemId(itemId);
    setDeleteOpen(true);
  }, []);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;

    const query = searchQuery.toLowerCase();
    return items.filter((item) => item.title.toLowerCase().includes(query));
  }, [items, searchQuery]);

  const { unchecked, checked } = useMemo(
    () => separateItemsByStatus(filteredItems),
    [filteredItems],
  );

  const total = useMemo(() => calculateTotal(filteredItems), [filteredItems]);

  const themeColors = themes[theme][colorScheme];
  const accentColor =
    themeColors[`--color-${currentList?.accentColor || 'primary'}`] ||
    themeColors['--color-primary'];
  const backgroundColor = themeColors['--color-card'];
  const textColor = themeColors['--color-foreground'];
  const mutedColor = themeColors['--color-muted'];

  return {
    listId,
    currentList,

    searchQuery,
    setSearchQuery,

    unchecked,
    checked,
    total,

    accentColor,
    backgroundColor,
    textColor,
    mutedColor,

    isCreateOpen,
    setCreateOpen,
    isUpdateOpen,
    setUpdateOpen,
    isDeleteOpen,
    setDeleteOpen,
    activeItemId,

    handleToggleCheck,
    handleOpenAdd,
    handleOpenUpdate,
    handleOpenDelete,
  };
};
