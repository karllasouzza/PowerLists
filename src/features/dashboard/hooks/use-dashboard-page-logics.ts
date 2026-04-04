import { useValue } from '@legendapp/state/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { listItems$ } from '@/data/states/list-items';
import { lists$ } from '@/data/states/lists';
import type { List, ListItem } from '@/data/types';
import { convertFromSupabaseFormat } from '@/lib/supabase/utils';

import type { DashboardPeriod } from '../types';
import { buildDashboardSummary, getPeriodLabel } from '../utils';

const normalizeList = (list: Partial<List>): List => {
  return {
    id: list.id ?? '',
    title: list.title ?? 'Lista sem título',
    accentColor: list.accentColor ?? 'primary',
    icon: list.icon ?? 'cart',
    profileId: list.profileId ?? '',
    listItems: list.listItems,
    createdAt: list.createdAt ?? new Date().toISOString(),
    updatedAt: list.updatedAt,
    deleted: list.deleted,
  };
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

export const useDashboardPageLogics = () => {
  const [period, setPeriod] = useState<DashboardPeriod>('all');
  const summaryCacheRef = useRef(
    new Map<DashboardPeriod, ReturnType<typeof buildDashboardSummary>>(),
  );

  const listsState = useValue(lists$.get());
  const listItemsState = useValue(listItems$.get());

  const isLoading = listsState === null || listItemsState === null;

  const lists = useMemo(() => {
    const rawLists = Object.values(listsState ?? {});
    const formattedLists = convertFromSupabaseFormat(rawLists) as Partial<List>[];

    return formattedLists.map(normalizeList);
  }, [listsState]);

  const items = useMemo(() => {
    const rawItems = Object.values(listItemsState ?? {});
    const formattedItems = convertFromSupabaseFormat(rawItems) as Partial<ListItem>[];

    return formattedItems.map(normalizeItem);
  }, [listItemsState]);

  useEffect(() => {
    summaryCacheRef.current.clear();
  }, [lists, items]);

  const summary = useMemo(() => {
    const cached = summaryCacheRef.current.get(period);
    if (cached) return cached;

    const nextSummary = buildDashboardSummary(lists, items, period);
    summaryCacheRef.current.set(period, nextSummary);

    return nextSummary;
  }, [items, lists, period]);

  return {
    period,
    setPeriod,
    periodLabel: getPeriodLabel(period),
    isLoading,
    ...summary,
  };
};
