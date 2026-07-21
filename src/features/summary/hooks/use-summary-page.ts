import { Q } from '@nozbe/watermelondb';
import { useEffect, useMemo, useRef, useState } from 'react';

import type { List, ListItem } from '@/types';
import { database } from '@/database';
import { List as ListModel } from '@/database/models/List';
import { ListItem as ListItemModel } from '@/database/models/ListItem';
import { getCurrentUserId } from '@/features/auth/authState';
import { getListsByProfile } from '@/database/operations/lists';
import { useObservableQuery } from '@/hooks/use-observable-query';

import type { SummaryPeriod } from '../types';
import { buildSummaryData, getPeriodLabel } from '../utils';

export const useSummaryPage = () => {
  const [period, setPeriod] = useState<SummaryPeriod>('all');
  const summaryCacheRef = useRef(
    new Map<SummaryPeriod, ReturnType<typeof buildSummaryData>>(),
  );

  const userId = getCurrentUserId() ?? '';

  const listsQuery = useMemo(() => getListsByProfile(userId), [userId]);
  const listsRaw = useObservableQuery<ListModel>(listsQuery);

  const itemsQuery = useMemo(
    () =>
      database
        .get<ListItemModel>('list_items')
        .query(Q.where('profile_id', userId), Q.where('deleted_at', Q.eq(null))),
    [userId],
  );
  const itemsRaw = useObservableQuery<ListItemModel>(itemsQuery);

  const isLoading = listsRaw === null || itemsRaw === null;

  const lists = useMemo((): List[] => {
    return [...listsRaw]
      .sort((a, b) => {
        const aDate = (a.updatedAt ?? a.createdAt).getTime();
        const bDate = (b.updatedAt ?? b.createdAt).getTime();
        return bDate - aDate;
      })
      .map((model) => ({
        id: model.id,
        title: model.title,
        accentColor: model.accentColor,
        icon: model.icon,
        profileId: model.profileId,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt ?? undefined,
      }));
  }, [listsRaw]);

  const items = useMemo((): ListItem[] => {
    return [...itemsRaw]
      .sort((a, b) => {
        const aDate = (a.updatedAt ?? a.createdAt).getTime();
        const bDate = (b.updatedAt ?? b.createdAt).getTime();
        return bDate - aDate;
      })
      .map((model) => ({
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

  useEffect(() => {
    summaryCacheRef.current.clear();
  }, [lists, items]);

  const summary = useMemo(() => {
    const cached = summaryCacheRef.current.get(period);
    if (cached) return cached;

    const nextSummary = buildSummaryData(lists, items, period);
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
