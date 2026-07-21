import type { List, ListItem } from '@/types';

export type SummaryPeriod = 'all' | 'week' | 'month' | 'year';

export type VariationTab = 'decreases' | 'increases';

export type SummaryDatePoint = {
  dateKey: string;
  label: string;
  averageUnitPrice: number;
  totalAmount: number;
  sampleCount: number;
};

export type SummaryPieSlice = {
  listId: string;
  x: string;
  icon: string;
  createdAt: Date;
  y: number;
  color: string;
};

export type SummaryRecentListCard = {
  listId: string;
  title: string;
  icon: string;
  accentColor: string;
  totalItems: number;
  totalPrice: number;
  checkedTotalPrice: number;
  createdAt: Date;
};

export type SummaryItemVariationDirection = 'increase' | 'decrease' | 'stable';

export type SummaryItemVariation = {
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
  direction: SummaryItemVariationDirection;
  occurrences: number;
  dailySeries: SummaryDatePoint[];
};

export type SummaryData = {
  totalCheckedPrice: number;
  totalLists: number;
  totalItems: number;
  pieSlices: SummaryPieSlice[];
  recentLists: SummaryRecentListCard[];
  increases: SummaryItemVariation[];
  decreases: SummaryItemVariation[];
};

export type SummaryRawData = {
  lists: List[];
  items: ListItem[];
};
