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
  const listFormatted = convertFromSupabaseFormat(Object.values(lists || {})) as List[];
  const [listsSelected, setListsSelected] = useState<string[]>([]);

  const filteredLists = useMemo(
    () => filterListsByQuery(listFormatted, searchQuery),
    [listFormatted, searchQuery],
  );

  const toggleSelectList = (id: string) => {
    setListsSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  const isSelected = (listId: string) => listsSelected.find((item) => item === listId);

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

    onSearch,
    setOnSearch,
    searchQuery,
    setSearchQuery,

    listsSelected,
    toggleSelectList,
    isSelected,

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
