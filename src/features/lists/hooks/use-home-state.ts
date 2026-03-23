import { useMemo, useState } from 'react';
import { lists$ } from '@/data/states/lists';
import { useValue } from '@legendapp/state/react';
import { convertFromSupabaseFormat } from '@/lib/supabase/utils';
import { List } from '@/data/types';
import { filterListsByQuery } from '../utils/list-filters';

export const useHomeState = () => {
  const [listEditId, setListEditId] = useState('');
  const [onSearch, setOnSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const lists = useValue(lists$.get());
  const listFormatted = convertFromSupabaseFormat(Object.values(lists || {})) as List[];

  const filteredLists = useMemo(
    () => filterListsByQuery(listFormatted, searchQuery),
    [listFormatted, searchQuery],
  );

  const returnOfMode = () => {
    setListEditId('');
  };

  return {
    lists: filteredLists,
    listEditId,
    setListEditId,
    onSearch,
    setOnSearch,
    searchQuery,
    setSearchQuery,
    returnOfMode,
  };
};
