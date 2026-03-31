import { useMemo, useState } from 'react';
import { lists$ } from '@/data/states/lists';
import { useValue } from '@legendapp/state/react';
import { convertFromSupabaseFormat } from '@/lib/supabase/utils';
import { List } from '@/data/types';
import { filterListsByQuery } from '../utils/list-filters';

export const useListPageLogics = () => {
  const [onSearch, setOnSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isUpdateOpen, setUpdateOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [activeListId, setActiveListId] = useState<string>();
  const lists = useValue(lists$.get());
  const isLoading = lists === null || lists === undefined;
  const listFormatted = convertFromSupabaseFormat(Object.values(lists || {})) as List[];

  const filteredLists = useMemo(
    () => filterListsByQuery(listFormatted, searchQuery),
    [listFormatted, searchQuery],
  );

  const handleOpenCreateModal = () => {
    setCreateOpen(true);
  };

  const handleOpenUpdateModal = (listId: string) => {
    setActiveListId(listId);
    setUpdateOpen(true);
  };

  const handleOpenDeleteModal = (listId: string) => {
    setActiveListId(listId);
    setDeleteOpen(true);
  };

  return {
    lists: filteredLists,
    isLoading,

    onSearch,
    setOnSearch,
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
