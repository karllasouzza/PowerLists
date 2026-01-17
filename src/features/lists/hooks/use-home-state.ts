import { useState } from 'react';
import { Mode, FormData } from '../types';

export const useHomeState = () => {
  const [listEditId, setListEditId] = useState('');
  const [mode, setMode] = useState<Mode>(null);
  const [defaultValues, setDefaultValues] = useState<Partial<FormData>>({});
  const [onSearch, setOnSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExtended, setIsExtended] = useState(true);

  const returnOfMode = () => {
    setListEditId('');
    setMode(null);
    setDefaultValues({});
  };

  return {
    listEditId,
    setListEditId,
    mode,
    setMode,
    defaultValues,
    setDefaultValues,
    onSearch,
    setOnSearch,
    searchQuery,
    setSearchQuery,
    isExtended,
    setIsExtended,
    returnOfMode,
  };
};
