import { Q } from '@nozbe/watermelondb';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import type { ListItem } from '@/types';
import { database } from '@/database';
import { ListItem as ListItemModel } from '@/database/models/ListItem';
import { getCurrentUserId } from '@/features/auth/authState';
import { useObservableQuery } from '@/hooks/use-observable-query';

import type { SummaryItemVariation, VariationTab } from '../types';
import {
  buildItemVariations,
  filterItemsByPeriod,
  getPeriodLabel,
  parseSummaryPeriod,
  splitItemVariations,
} from '../utils';

export const useItemVariationsPageLogics = () => {
  const router = useRouter();
  const { period: periodParam } = useLocalSearchParams<{ period?: string }>();
  const [tab, setTab] = useState<VariationTab>('decreases');

  const period = parseSummaryPeriod(periodParam);

  const userId = getCurrentUserId() ?? '';
  const itemsQuery = useMemo(
    () =>
      database
        .get<ListItemModel>('list_items')
        .query(Q.where('profile_id', userId), Q.where('deleted_at', Q.eq(null))),
    [userId],
  );
  const itemsRaw = useObservableQuery<ListItemModel>(itemsQuery);
  const isLoading = itemsRaw === null;

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
    (item: SummaryItemVariation) => {
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
