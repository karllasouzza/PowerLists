import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

import type { List, ListItem } from '@/data/types';

import type {
  DashboardDatePoint,
  DashboardItemVariation,
  DashboardPeriod,
  DashboardPieSlice,
  DashboardRecentListCard,
  DashboardSummary,
} from '../types';

dayjs.extend(isoWeek);

const PIE_COLORS = ['#4C8E4A', '#81B979', '#A8D39B', '#6CA862', '#2E6A32', '#DCEFD3', '#B1DBA9'];

const EMPTY_DAILY_SERIES: DashboardDatePoint[] = [];

const toDate = (value?: string | Date | null): Date | null => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

const resolveItemDate = (item: ListItem): Date => {
  // Requirement decision: use createdAt as source with updatedAt fallback.
  const createdAt = toDate(item.createdAt);
  if (createdAt) return createdAt;

  const updatedAt = toDate(item.updatedAt);
  if (updatedAt) return updatedAt;

  return new Date();
};

const resolveListDate = (list: List): Date => {
  return toDate(list.createdAt) ?? new Date(0);
};

const getDateKey = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};

const getDateLabel = (dateKey: string): string => {
  const date = new Date(`${dateKey}T00:00:00`);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  }).format(date);
};

const normalizeTitleKey = (title?: string | null): string => {
  return (title ?? '').trim().toLocaleLowerCase('pt-BR');
};

const calculateItemTotalPrice = (item: Pick<ListItem, 'price' | 'amount'>): number => {
  const price = item.price ?? 0;
  const amount = item.amount ?? 0;
  return price * amount;
};

const calculateItemsTotalPrice = (items: Pick<ListItem, 'price' | 'amount'>[]): number => {
  return items.reduce((total, item) => total + calculateItemTotalPrice(item), 0);
};

export const filterItemsByPeriod = (
  items: ListItem[],
  period: DashboardPeriod,
  now: Date = new Date(),
): ListItem[] => {
  if (period === 'all') return items;

  const nowDate = dayjs(now);
  const periodStart =
    period === 'week'
      ? nowDate.startOf('isoWeek')
      : period === 'month'
        ? nowDate.startOf('month')
        : nowDate.startOf('year');

  return items.filter((item) => {
    const itemDate = dayjs(resolveItemDate(item));
    return !itemDate.isBefore(periodStart) && !itemDate.isAfter(nowDate);
  });
};

const getItemsByListId = (items: ListItem[]): Map<string, ListItem[]> => {
  return items.reduce((map, item) => {
    const key = item.listId;
    const current = map.get(key) ?? [];
    current.push(item);
    map.set(key, current);
    return map;
  }, new Map<string, ListItem[]>());
};

export const getTotalCheckedPrice = (items: ListItem[]): number => {
  const checkedItems = items.filter((item) => item.isChecked);
  return calculateItemsTotalPrice(checkedItems);
};

export const buildRecentListCards = (
  lists: List[],
  items: ListItem[],
  count = 3,
): DashboardRecentListCard[] => {
  const itemsByListId = getItemsByListId(items);

  return [...lists]
    .sort((a, b) => resolveListDate(b).getTime() - resolveListDate(a).getTime())
    .slice(0, count)
    .map((list) => {
      const listItems = itemsByListId.get(list.id) ?? [];
      const checkedItems = listItems.filter((item) => item.isChecked);

      return {
        listId: list.id,
        title: list.title,
        icon: list.icon,
        accentColor: list.accentColor,
        totalItems: listItems.length,
        totalPrice: calculateItemsTotalPrice(listItems),
        checkedTotalPrice: calculateItemsTotalPrice(checkedItems),
        createdAt: resolveListDate(list),
      };
    });
};

export const buildPieSlices = (lists: List[], periodItems: ListItem[]): DashboardPieSlice[] => {
  const itemsByListId = getItemsByListId(periodItems);

  return [...lists]
    .sort((a, b) => resolveListDate(b).getTime() - resolveListDate(a).getTime())
    .map((list, index) => {
      const listItems = itemsByListId.get(list.id) ?? [];
      const checkedTotal = calculateItemsTotalPrice(listItems.filter((item) => item.isChecked));

      return {
        listId: list.id,
        x: list.title,
        icon: list.icon,
        createdAt: resolveListDate(list),
        y: checkedTotal,
        color: PIE_COLORS[index % PIE_COLORS.length],
      };
    });
};

type DailyBucket = {
  dateKey: string;
  totalAmount: number;
  totalPrice: number;
  sampleCount: number;
};

const buildDailySeries = (items: ListItem[]): DashboardDatePoint[] => {
  if (!items.length) return EMPTY_DAILY_SERIES;

  const dailyMap = items.reduce((map, item) => {
    const unitPrice = item.price ?? 0;
    if (unitPrice <= 0) return map;

    const dateKey = getDateKey(resolveItemDate(item));
    const current = map.get(dateKey) ?? {
      dateKey,
      totalAmount: 0,
      totalPrice: 0,
      sampleCount: 0,
    };

    current.totalAmount += item.amount ?? 0;
    current.totalPrice += unitPrice;
    current.sampleCount += 1;

    map.set(dateKey, current);

    return map;
  }, new Map<string, DailyBucket>());

  return [...dailyMap.values()]
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
    .map((bucket) => ({
      dateKey: bucket.dateKey,
      label: getDateLabel(bucket.dateKey),
      averageUnitPrice: bucket.sampleCount > 0 ? bucket.totalPrice / bucket.sampleCount : 0,
      totalAmount: bucket.totalAmount,
      sampleCount: bucket.sampleCount,
    }));
};

const buildItemVariation = (key: string, items: ListItem[]): DashboardItemVariation | null => {
  const pricedItems = items.filter((item) => (item.price ?? 0) > 0);
  if (!pricedItems.length) return null;

  const sortedByDate = [...pricedItems].sort(
    (a, b) => resolveItemDate(a).getTime() - resolveItemDate(b).getTime(),
  );

  const prices = sortedByDate.map((item) => item.price ?? 0);
  const dailySeries = buildDailySeries(sortedByDate);
  const firstUnitPrice = dailySeries[0]?.averageUnitPrice ?? prices[0] ?? 0;
  const lastUnitPrice =
    dailySeries[dailySeries.length - 1]?.averageUnitPrice ?? prices[prices.length - 1] ?? 0;
  const previousUnitPrice =
    dailySeries.length > 1
      ? (dailySeries[dailySeries.length - 2]?.averageUnitPrice ?? null)
      : prices.length > 1
        ? (prices[prices.length - 2] ?? null)
        : null;

  const changePercent =
    firstUnitPrice > 0 ? ((lastUnitPrice - firstUnitPrice) / firstUnitPrice) * 100 : 0;

  // direction based on most recent movement (previous → last) to match what is displayed in the row
  const recentDelta =
    previousUnitPrice !== null && previousUnitPrice > 0
      ? ((lastUnitPrice - previousUnitPrice) / previousUnitPrice) * 100
      : changePercent;
  const direction = recentDelta > 0.01 ? 'increase' : recentDelta < -0.01 ? 'decrease' : 'stable';

  const totalAmount = sortedByDate.reduce((acc, item) => acc + (item.amount ?? 0), 0);
  const averageUnitPrice = prices.reduce((acc, price) => acc + price, 0) / prices.length;

  return {
    key,
    title: sortedByDate[0]?.title?.trim() || 'Item sem nome',
    totalAmount,
    minUnitPrice: Math.min(...prices),
    maxUnitPrice: Math.max(...prices),
    averageUnitPrice,
    firstUnitPrice,
    previousUnitPrice,
    lastUnitPrice,
    changePercent,
    direction,
    occurrences: sortedByDate.length,
    dailySeries,
  };
};

type BuildItemVariationsOptions = {
  includeDailySeries?: boolean;
};

const buildItemVariationWithoutDailySeries = (
  key: string,
  items: ListItem[],
): DashboardItemVariation | null => {
  const pricedItems = items.filter((item) => (item.price ?? 0) > 0);
  if (!pricedItems.length) return null;

  const sortedByDate = [...pricedItems].sort(
    (a, b) => resolveItemDate(a).getTime() - resolveItemDate(b).getTime(),
  );

  // Group prices by day (same logic as buildDailySeries) so that multiple
  // entries on the same day are averaged into a single data point.
  const dailyPriceMap = sortedByDate.reduce((map, item) => {
    const dateKey = getDateKey(resolveItemDate(item));
    const bucket = map.get(dateKey) ?? { totalPrice: 0, sampleCount: 0 };
    bucket.totalPrice += item.price ?? 0;
    bucket.sampleCount += 1;
    map.set(dateKey, bucket);
    return map;
  }, new Map<string, { totalPrice: number; sampleCount: number }>());

  const dailyAveragePrices = [...dailyPriceMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, bucket]) => bucket.totalPrice / bucket.sampleCount);

  const firstUnitPrice = dailyAveragePrices[0] ?? 0;
  const lastUnitPrice = dailyAveragePrices[dailyAveragePrices.length - 1] ?? 0;
  const previousUnitPrice =
    dailyAveragePrices.length > 1
      ? (dailyAveragePrices[dailyAveragePrices.length - 2] ?? null)
      : null;

  const changePercent =
    firstUnitPrice > 0 ? ((lastUnitPrice - firstUnitPrice) / firstUnitPrice) * 100 : 0;

  // direction based on most recent movement (previous → last) to match what is displayed in the row
  const recentDelta =
    previousUnitPrice !== null && previousUnitPrice > 0
      ? ((lastUnitPrice - previousUnitPrice) / previousUnitPrice) * 100
      : changePercent;
  const direction = recentDelta > 0.01 ? 'increase' : recentDelta < -0.01 ? 'decrease' : 'stable';

  const totalAmount = sortedByDate.reduce((acc, item) => acc + (item.amount ?? 0), 0);
  const allPrices = sortedByDate.map((item) => item.price ?? 0);
  const averageUnitPrice = allPrices.reduce((acc, price) => acc + price, 0) / allPrices.length;

  return {
    key,
    title: sortedByDate[0]?.title?.trim() || 'Item sem nome',
    totalAmount,
    minUnitPrice: Math.min(...allPrices),
    maxUnitPrice: Math.max(...allPrices),
    averageUnitPrice,
    firstUnitPrice,
    previousUnitPrice,
    lastUnitPrice,
    changePercent,
    direction,
    occurrences: sortedByDate.length,
    dailySeries: EMPTY_DAILY_SERIES,
  };
};

export const buildItemVariations = (
  periodItems: ListItem[],
  options?: BuildItemVariationsOptions,
): DashboardItemVariation[] => {
  const includeDailySeries = options?.includeDailySeries ?? true;

  const groupedItems = periodItems.reduce((map, item) => {
    const key = normalizeTitleKey(item.title);
    if (!key) return map;

    const group = map.get(key) ?? [];
    group.push(item);
    map.set(key, group);
    return map;
  }, new Map<string, ListItem[]>());

  return [...groupedItems.entries()]
    .map(([key, items]) =>
      includeDailySeries
        ? buildItemVariation(key, items)
        : buildItemVariationWithoutDailySeries(key, items),
    )
    .filter((item): item is DashboardItemVariation => item !== null);
};

export const splitItemVariations = (variations: DashboardItemVariation[]) => {
  const increases = variations
    .filter((item) => item.direction === 'increase')
    .sort((a, b) => b.changePercent - a.changePercent);

  const decreases = variations
    .filter((item) => item.direction === 'decrease')
    .sort((a, b) => a.changePercent - b.changePercent);

  return { increases, decreases };
};

export const findItemVariationByKey = (
  variations: DashboardItemVariation[],
  key?: string,
): DashboardItemVariation | null => {
  if (!key) return null;
  return variations.find((variation) => variation.key === key) ?? null;
};

export const calculateAverageDailyVariationPercent = (series: DashboardDatePoint[]): number => {
  if (series.length < 2) return 0;

  const dailyVariations: number[] = [];

  for (let index = 1; index < series.length; index += 1) {
    const previous = series[index - 1]?.averageUnitPrice ?? 0;
    const current = series[index]?.averageUnitPrice ?? 0;

    if (previous <= 0) continue;

    dailyVariations.push(((current - previous) / previous) * 100);
  }

  if (!dailyVariations.length) return 0;

  return dailyVariations.reduce((sum, value) => sum + value, 0) / dailyVariations.length;
};

export const buildDashboardSummary = (
  lists: List[],
  items: ListItem[],
  period: DashboardPeriod,
): DashboardSummary => {
  const periodItems = filterItemsByPeriod(items, period);
  const variations = buildItemVariations(periodItems, { includeDailySeries: false });
  const { increases, decreases } = splitItemVariations(variations);

  return {
    totalCheckedPrice: getTotalCheckedPrice(periodItems),
    pieSlices: buildPieSlices(lists, periodItems),
    recentLists: buildRecentListCards(lists, items, 3),
    increases,
    decreases,
  };
};

export const getPeriodLabel = (period: DashboardPeriod): string => {
  if (period === 'all') return 'Todo o histórico';
  if (period === 'week') return 'Últimos 7 dias';
  if (period === 'month') return 'Últimos 30 dias';
  return 'Últimos 12 meses';
};
