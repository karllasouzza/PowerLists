import { useValue } from '@legendapp/state/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { listItems$ } from '@/data/states/list-items';
import type { ListItem } from '@/data/types';
import { convertFromSupabaseFormat } from '@/lib/supabase/utils';

import type { DashboardItemVariation, DashboardPeriod, VariationTab } from '../types';
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
  const router = useRouter();
  const { period: periodParam } = useLocalSearchParams<{ period?: string }>();
  const [tab, setTab] = useState<VariationTab>('decreases');

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

  const selectedItems = useMemo(
    () => (tab === 'decreases' ? decreases : increases),
    [tab, decreases, increases],
  );

  const handleTabChange = useCallback((value: string) => {
    setTab(value as VariationTab);
  }, []);

  const handleOpenItemVariations = useCallback(
    (item: DashboardItemVariation) => {
      router.push({
        pathname: '/item-variations',
        params: {
          itemKey: item.key,
          itemTitle: item.title,
          period,
        },
      });
    },
    [period, router],
  );

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return {
    tab,
    period,
    periodLabel: getPeriodLabel(period),
    selectedItems,
    isLoading,
    handleTabChange,
    handleOpenItemVariations,
    handleBack,
  };
};
