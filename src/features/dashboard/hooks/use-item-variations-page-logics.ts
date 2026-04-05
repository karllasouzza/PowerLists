import { useValue } from '@legendapp/state/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { listItems$ } from '@/data/states/list-items';
import type { ListItem } from '@/data/types';
import { convertFromSupabaseFormat } from '@/lib/supabase/utils';

import type { DashboardItemVariation, VariationTab } from '../types';
import {
  buildItemVariations,
  filterItemsByPeriod,
  getPeriodLabel,
  parseDashboardPeriod,
  splitItemVariations,
} from '../utils';

const normalizeItem = (item: Partial<ListItem>): ListItem => {
  return {
    id: item.id ?? '',
    listId: item.listId ?? '',
    profileId: item.profileId ?? '',
    title: item.title ?? '',
    price: item.price ?? 0,
    amount: item.amount ?? 0,
    isChecked: item.isChecked ?? false,
    createdAt: item.createdAt ?? new Date().toISOString(),
    updatedAt: item.updatedAt,
    deleted: item.deleted,
  };
};

export const useItemVariationsPageLogics = () => {
  const router = useRouter();
  const { period: periodParam } = useLocalSearchParams<{ period?: string }>();
  const [tab, setTab] = useState<VariationTab>('decreases');

  const period = parseDashboardPeriod(periodParam);
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

  const handleOpenItemComparison = useCallback(
    (item: DashboardItemVariation) => {
      router.push({
        pathname: '/item-comparison',
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
    handleOpenItemComparison,
    handleBack,
  };
};
