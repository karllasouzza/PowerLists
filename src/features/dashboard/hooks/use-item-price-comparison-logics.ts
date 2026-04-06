import { useValue } from '@legendapp/state/react';
import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';

import { listItems$ } from '@/data/states/list-items';
import type { ListItem } from '@/data/types';
import { convertFromSupabaseFormat } from '@/lib/supabase/utils';

import {
  buildItemVariations,
  calculateAverageDailyVariationPercent,
  filterItemsByPeriod,
  getPeriodLabel,
  parseDashboardPeriod,
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

export const useItemPriceComparisonLogics = () => {
  const {
    itemKey,
    itemTitle,
    period: periodParam,
  } = useLocalSearchParams<{
    itemKey?: string;
    itemTitle?: string;
    period?: string;
  }>();

  const period = parseDashboardPeriod(periodParam);
  const listItemsState = useValue(listItems$.get());

  const allItems = useMemo(() => {
    const rawItems = Object.values(listItemsState ?? {});
    const formattedItems = convertFromSupabaseFormat(rawItems) as Partial<ListItem>[];

    return formattedItems.map(normalizeItem);
  }, [listItemsState]);

  const periodItems = useMemo(() => filterItemsByPeriod(allItems, period), [allItems, period]);

  const variation = useMemo(() => {
    const variations = buildItemVariations(periodItems);

    if (itemKey) {
      const byKey = variations.find((item) => item.key === itemKey);
      if (byKey) return byKey;
    }

    const normalizedTitle = (itemTitle ?? '').trim().toLocaleLowerCase('pt-BR');
    if (!normalizedTitle) return null;

    return variations.find((item) => item.key === normalizedTitle) ?? null;
  }, [itemKey, itemTitle, periodItems]);

  const averageDailyVariation = useMemo(() => {
    if (!variation) return 0;
    return calculateAverageDailyVariationPercent(variation.dailySeries);
  }, [variation]);

  return {
    period,
    periodLabel: getPeriodLabel(period),
    variation,
    averageDailyVariation,
    hasData: Boolean(variation),
  };
};
