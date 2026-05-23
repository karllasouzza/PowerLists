import { useCallback, useMemo, useState } from 'react';
import { Q } from '@nozbe/watermelondb';

import { database } from '@/database';
import { List as ListModel } from '@/database/models/List';
import { ListItem as ListItemModel } from '@/database/models/ListItem';
import { useObservableQuery } from '@/hooks/use-observable-query';
import { getCurrentUserId } from '@/features/auth/authState';
import { getListsByProfile } from '@/database/operations/lists';
import { formatCurrency } from '@/utils/formatters';

import { filterListsByQuery } from '../utils/list-filters';
import { buildTotalsByListId } from '../utils/list-totals';

export const useListPageLogics = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isUpdateOpen, setUpdateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [activeListId, setActiveListId] = useState<string>();

  const userId = getCurrentUserId() ?? '';
  const listsQuery = useMemo(() => getListsByProfile(userId), [userId]);
  const listsRaw = useObservableQuery<ListModel>(listsQuery);

  const itemsQuery = useMemo(
    () =>
      database
        .get<ListItemModel>('list_items')
        .query(Q.where('profile_id', userId), Q.where('deleted_at', Q.eq(null))),
    [userId],
  );
  const itemsRaw = useObservableQuery<ListItemModel>(itemsQuery);

  const totalsByListId = useMemo(() => {
    return buildTotalsByListId(
      itemsRaw.map((item) => ({
        list_id: item.listId,
        price: item.price,
        amount: item.amount,
      })),
    );
  }, [itemsRaw]);

  const filteredLists = useMemo(
    () => filterListsByQuery(listsRaw as any, searchQuery),
    [listsRaw, searchQuery],
  );

  const formattedTotalsByListId = useMemo(() => {
    const totals: Record<string, string> = {};
    for (const list of filteredLists) {
      totals[list.id] = formatCurrency(totalsByListId[list.id] ?? 0);
    }
    return totals;
  }, [filteredLists, totalsByListId]);

  const handleOpenCreateModal = useCallback(() => {
    setCreateOpen(true);
  }, []);

  const handleOpenUpdateModal = useCallback((listId: string) => {
    setActiveListId(listId);
    setUpdateOpen(true);
  }, []);

  const handleOpenDeleteModal = useCallback((listId: string) => {
    setActiveListId(listId);
    setDeleteOpen(true);
  }, []);

  return {
    lists: filteredLists,
    listTotalsById: formattedTotalsByListId,
    isLoading: false,
    searchQuery,
    setSearchQuery,
    isCreateOpen,
    setCreateOpen,
    isUpdateOpen,
    setUpdateOpen,
    isDeleteOpen,
    setDeleteOpen,
    activeListId,
    handleOpenCreateModal,
    handleOpenUpdateModal,
    handleOpenDeleteModal,
  };
};
