import { useSelector, useValue } from '@legendapp/state/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { listItems$ } from '@/data/states/list-items';
import { lists$ } from '@/data/states/lists';
import { ListItem as DataListItem, List, ListItem } from '@/data/types';
import { getAccentColorOption } from '@/features/lists/utils/accent-colors';
import { convertFromSupabaseFormat } from '@/lib/supabase/utils';
import { calculateTotal } from '@/utils/formatters';
import { SortMode, sortItems } from '@/utils/sorting';
import { toggleCheckListItem } from '@/data/actions/list-items';

export const useListItemsPageLogics = () => {
  const { id: listId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const lists = useValue(lists$ || {});
  const listsFormated = convertFromSupabaseFormat(Object.values(lists || {})) as List[];
  const currentList = listsFormated.find((list) => list.id === listId);

  const items = useSelector(() => {
    if (!listId) return [] as ListItem[];
    const raw = Object.values(listItems$.get() ?? {}).filter((item) => item.list_id === listId);
    return (convertFromSupabaseFormat(raw) as DataListItem[]).map((item) => ({
      ...item,
      title: item.title ?? '',
      price: item.price ?? 0,
      amount: item.amount ?? 0,
    })) as ListItem[];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('default');
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
    return items.filter((item) => item.title?.toLowerCase().includes(query));
  }, [items, searchQuery]);

  const sortedItems = useMemo(() => sortItems(filteredItems, sortMode), [filteredItems, sortMode]);
  const checkedItems = useMemo(() => sortedItems.filter((item) => item.isChecked), [sortedItems]);

  const total = useMemo(() => calculateTotal(sortedItems), [sortedItems]);
  const payableTotal = useMemo(() => calculateTotal(checkedItems), [checkedItems]);
  const activeItem = useMemo(
    () => sortedItems.find((item) => item.id === activeItemId) ?? null,
    [activeItemId, sortedItems],
  );

  const accentColorOption = useMemo(
    () => getAccentColorOption(currentList?.accentColor),
    [currentList?.accentColor],
  );

  const handleOpenAssistant = useCallback(() => {
    router.push({
      pathname: '/assistant',
      params: { id: listId },
    });
  }, [listId, router]);

  return {
    listId,
    currentList,

    searchQuery,
    setSearchQuery,
    sortMode,
    setSortMode,

    items: sortedItems,
    total,
    payableTotal,

    accentBgClassName: accentColorOption.cardClassName,
    accentForegroundClassName: accentColorOption.cardForegroundClassName,

    isCreateOpen,
    setCreateOpen,
    isUpdateOpen,
    setUpdateOpen,
    isDeleteOpen,
    setDeleteOpen,
    activeItemId,
    activeItem,

    handleToggleCheck,
    handleOpenAdd,
    handleOpenUpdate,
    handleOpenDelete,

    handleOpenAssistant,
  };
};
