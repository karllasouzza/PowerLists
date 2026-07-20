import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { ListItem } from '@/types';
import { List as ListModel } from '@/database/models/List';
import { ListItem as ListItemModel } from '@/database/models/ListItem';
import { database } from '@/database';
import { useObservableQuery } from '@/hooks/use-observable-query';
import { getListItemsByListId, toggleCheckListItem } from '@/database/operations/listItems';
import { getAccentColorOption } from '@/features/lists/utils/accent-colors';
import { calculateTotal } from '@/utils/formatters';
import { SortMode, sortItems } from '@/utils/sorting';

export const useListItemsPageLogics = () => {
  const { id: listId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [currentList, setCurrentList] = useState<ListModel | null>(null);

  useEffect(() => {
    if (listId) {
      database
        .get<ListModel>('lists')
        .find(listId)
        .then(setCurrentList)
        .catch(() => setCurrentList(null));
    } else {
      setCurrentList(null);
    }
  }, [listId]);

  const itemsQuery = useMemo(() => getListItemsByListId(listId), [listId]);
  const itemsRaw = useObservableQuery<ListItemModel>(itemsQuery);

  const itemsPlain = useMemo((): ListItem[] => {
    return itemsRaw.map((model) => ({
      id: model.id,
      listId: model.listId,
      profileId: model.profileId,
      title: model.title,
      price: model.price,
      amount: model.amount,
      isChecked: model.isChecked,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt ?? undefined,
    }));
  }, [itemsRaw]);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('default');
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isUpdateOpen, setUpdateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string>();

  const handleToggleCheck = useCallback(async (id: string, currentStatus: boolean) => {
    try {
      await toggleCheckListItem(id, !currentStatus);
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
    if (!searchQuery.trim()) return itemsPlain;
    const query = searchQuery.toLowerCase();
    return itemsPlain.filter((item) => item.title?.toLowerCase().includes(query));
  }, [itemsPlain, searchQuery]);

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
