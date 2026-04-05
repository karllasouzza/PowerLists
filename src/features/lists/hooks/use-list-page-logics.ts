import { useCallback, useMemo, useState } from 'react';
import { useSelector, useValue } from '@legendapp/state/react';

import { listItems$ } from '@/data/states/list-items';
import { lists$ } from '@/data/states/lists';
import type { List } from '@/data/types';
import { convertFromSupabaseFormat } from '@/lib/supabase/utils';
import { formatCurrency } from '@/utils/formatters';

import { filterListsByQuery } from '../utils/list-filters';
import { buildTotalsByListId, type RawListItem } from '../utils/list-totals';

export const useListPageLogics = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isUpdateOpen, setUpdateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [activeListId, setActiveListId] = useState<string>();
  const listsRaw = useValue(lists$);

  const isLoading = listsRaw === null || listsRaw === undefined;

  const listFormatted = useMemo(
    () => convertFromSupabaseFormat(Object.values(listsRaw || {})) as List[],
    [listsRaw],
  );

  const totalsByListId = useSelector(() => {
    const rawListItems = Object.values(listItems$.get() ?? {}) as RawListItem[];
    return buildTotalsByListId(rawListItems);
  });

  const filteredLists = useMemo(
    () => filterListsByQuery(listFormatted, searchQuery),
    [listFormatted, searchQuery],
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
    isLoading,

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
