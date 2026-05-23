import { Q } from '@nozbe/watermelondb';
import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';

import type { ListItem } from '@/types';
import { database } from '@/database';
import { ListItem as ListItemModel } from '@/database/models/ListItem';
import { getCurrentUserId } from '@/features/auth/authState';
import { useObservableQuery } from '@/hooks/use-observable-query';

import {
  buildItemVariations,
  calculateAverageDailyVariationPercent,
  filterItemsByPeriod,
  getPeriodLabel,
  parseDashboardPeriod,
} from '../utils';

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

  const userId = getCurrentUserId() ?? '';
  const itemsQuery = useMemo(
    () =>
      database
        .get<ListItemModel>('list_items')
        .query(Q.where('profile_id', userId), Q.where('deleted_at', Q.eq(null))),
    [userId],
  );
  const itemsRaw = useObservableQuery<ListItemModel>(itemsQuery);

  const allItems = useMemo((): ListItem[] => {
    return itemsRaw.map((model) => ({
      id: model.id,
      listId: model.listId,
      profileId: model.profileId,
      title: model.title,
      price: model.price,
      amount: model.amount,
      isChecked: model.isChecked,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt ?? undefined,
    }));
  }, [itemsRaw]);

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
