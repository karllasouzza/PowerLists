import { useValue } from '@legendapp/state/react';
import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';

import { listItems$ } from '@/data/states/list-items';
import type { ListItem } from '@/data/types';
import { convertFromSupabaseFormat } from '@/lib/supabase/utils';

import type { DashboardPeriod } from '../types';
import {
  buildItemVariations,
  filterItemsByPeriod,
  getPeriodLabel,
  splitItemVariations,
} from '../utils';

const parsePeriodParam = (value?: string): DashboardPeriod => {
  if (value === 'all' || value === 'week' || value === 'month' || value === 'year') return value;
  return 'all';
};

const normalizeItem = (item: Partial<ListItem>): ListItem => {
  return {
    id: item.id ?? '',
    listId: item.listId ?? '',
    profileId: item.profileId ?? '',
    title: item.title ?? '',
    price: item.price ?? 0,
    amount: item.amount ?? 0,
    isChecked: item.isChecked ?? false,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    deleted: item.deleted,
  };
};

export const useItemVariationsPageLogics = () => {
  const { period: periodParam } = useLocalSearchParams<{ period?: string }>();

  const period = parsePeriodParam(periodParam);
  const listItemsState = useValue(listItems$.get());
  const isLoading = listItemsState === null;

  const allItems = useMemo(() => {
    const rawItems = Object.values(listItemsState ?? {});
    const formattedItems = convertFromSupabaseFormat(rawItems) as Partial<ListItem>[];

    return formattedItems.map(normalizeItem);
  }, [listItemsState]);

  const periodItems = useMemo(() => filterItemsByPeriod(allItems, period), [allItems, period]);

  const { increases, decreases } = useMemo(() => {
    const variations = buildItemVariations(periodItems, { includeDailySeries: false });
    return splitItemVariations(variations);
  }, [periodItems]);

  return {
    period,
    periodLabel: getPeriodLabel(period),
    increases,
    decreases,
    isLoading,
  };
};
