import type { List, ListItem } from '@/data/types';

export type DashboardPeriod = 'all' | 'week' | 'month' | 'year';

export type VariationTab = 'decreases' | 'increases';

export type DashboardDatePoint = {
  dateKey: string;
  label: string;
  averageUnitPrice: number;
  totalAmount: number;
  sampleCount: number;
};

export type DashboardPieSlice = {
  listId: string;
  x: string;
  icon: string;
  createdAt: Date;
  y: number;
  color: string;
};

export type DashboardRecentListCard = {
  listId: string;
  title: string;
  icon: string;
  accentColor: string;
  totalItems: number;
  totalPrice: number;
  checkedTotalPrice: number;
  createdAt: Date;
};

export type DashboardItemVariationDirection = 'increase' | 'decrease' | 'stable';

export type DashboardItemVariation = {
  key: string;
  title: string;
  totalAmount: number;
  minUnitPrice: number;
  maxUnitPrice: number;
  averageUnitPrice: number;
  firstUnitPrice: number;
  previousUnitPrice: number | null;
  lastUnitPrice: number;
  changePercent: number;
  direction: DashboardItemVariationDirection;
  occurrences: number;
  dailySeries: DashboardDatePoint[];
};

export type DashboardSummary = {
  totalCheckedPrice: number;
  pieSlices: DashboardPieSlice[];
  recentLists: DashboardRecentListCard[];
  increases: DashboardItemVariation[];
  decreases: DashboardItemVariation[];
};

export type DashboardRawData = {
  lists: List[];
  items: ListItem[];
};
