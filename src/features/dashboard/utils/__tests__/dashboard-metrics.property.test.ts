import type { List, ListItem } from '@/data/types';
import {
  buildDashboardSummary,
  buildItemVariations,
  calculateAverageDailyVariationPercent,
  filterItemsByPeriod,
  getTotalCheckedPrice,
} from '@/features/dashboard/utils';
import type { DashboardDatePoint } from '@/features/dashboard/types';
import { describe, expect, it } from '@jest/globals';
import { Decimal } from 'decimal.js';
import {
  array,
  assert,
  boolean,
  constantFrom,
  date,
  integer,
  option,
  property,
  record,
  uuid,
} from 'fast-check';

const centsArb = integer({ min: 0, max: 200_000 });
const priceArb = centsArb.map((cents) => new Decimal(cents).div(100).toNumber());
const amountArb = integer({ min: 0, max: 100 });
const isoDateArb = date({
  min: new Date('2020-01-01T00:00:00.000Z'),
  max: new Date('2030-12-31T23:59:59.999Z'),
}).map((value) => {
  if (Number.isNaN(value.getTime())) {
    return '2026-04-05T10:00:00.000Z';
  }

  return value.toISOString();
});

const itemArb = record<ListItem>({
  id: uuid(),
  profileId: uuid(),
  listId: uuid(),
  title: option(constantFrom('arroz', 'feijao', 'leite', 'cafe'), { nil: null }),
  price: option(priceArb, { nil: null }),
  amount: option(amountArb, { nil: null }),
  isChecked: boolean(),
  createdAt: isoDateArb,
  updatedAt: option(isoDateArb, { nil: null }),
  deleted: option(boolean(), { nil: null }),
});

const titledPricedItemArb = record<ListItem>({
  id: uuid(),
  profileId: uuid(),
  listId: uuid(),
  title: constantFrom('arroz', 'feijao', 'leite', 'cafe'),
  price: priceArb.filter((value) => value > 0),
  amount: amountArb,
  isChecked: boolean(),
  createdAt: isoDateArb,
  updatedAt: option(isoDateArb, { nil: null }),
  deleted: option(boolean(), { nil: null }),
});

const toCents = (value: number): number => {
  return Math.round(value * 100);
};

const buildListsFromItems = (items: ListItem[]): List[] => {
  const map = new Map<string, List>();

  for (const item of items) {
    if (!map.has(item.listId)) {
      map.set(item.listId, {
        id: item.listId,
        title: `Lista ${item.listId.slice(0, 4)}`,
        accentColor: 'primary',
        icon: 'cart',
        profileId: item.profileId,
        createdAt: item.createdAt,
      });
    }
  }

  return [...map.values()];
};

describe('dashboard-metrics', () => {
  it('should calculate total checked price correctly in a real-world scenario', () => {
    const items: ListItem[] = [
      {
        id: '1',
        profileId: 'p1',
        listId: 'l1',
        title: 'Arroz',
        price: 12.5,
        amount: 2,
        isChecked: true,
        createdAt: '2026-04-05T10:00:00.000Z',
        updatedAt: null,
        deleted: null,
      },
      {
        id: '2',
        profileId: 'p1',
        listId: 'l1',
        title: 'Feijao',
        price: 8.4,
        amount: 1,
        isChecked: false,
        createdAt: '2026-04-05T11:00:00.000Z',
        updatedAt: null,
        deleted: null,
      },
      {
        id: '3',
        profileId: 'p1',
        listId: 'l2',
        title: 'Leite',
        price: 4.99,
        amount: 3,
        isChecked: true,
        createdAt: '2026-04-05T12:00:00.000Z',
        updatedAt: null,
        deleted: null,
      },
    ];

    const expected = new Decimal(12.5).mul(2).plus(new Decimal(4.99).mul(3));
    expect(toCents(getTotalCheckedPrice(items))).toBe(toCents(expected.toNumber()));
  });

  it('should return the same reference for filterItemsByPeriod("all")', () => {
    const items: ListItem[] = [];

    expect(filterItemsByPeriod(items, 'all')).toBe(items);
  });

  it('should calculate average daily variation correctly', () => {
    const series: DashboardDatePoint[] = [
      {
        dateKey: '2026-04-01',
        label: '01/04',
        averageUnitPrice: 10,
        totalAmount: 2,
        sampleCount: 1,
      },
      {
        dateKey: '2026-04-02',
        label: '02/04',
        averageUnitPrice: 15,
        totalAmount: 2,
        sampleCount: 1,
      },
      {
        dateKey: '2026-04-03',
        label: '03/04',
        averageUnitPrice: 30,
        totalAmount: 2,
        sampleCount: 1,
      },
    ];

    expect(calculateAverageDailyVariationPercent(series)).toBeCloseTo(75, 6);
  });

  it('should match Decimal oracle for random batches when computing total checked price', () => {
    assert(
      property(array(itemArb, { minLength: 0, maxLength: 120 }), (items) => {
        const expected = items
          .filter((item) => item.isChecked)
          .reduce((accum, item) => {
            return accum.plus(new Decimal(item.price ?? 0).mul(item.amount ?? 0));
          }, new Decimal(0));

        expect(toCents(getTotalCheckedPrice(items))).toBe(toCents(expected.toNumber()));
      }),
    );
  });

  it('should preserve expected totalCheckedPrice when calling buildDashboardSummary("all")', () => {
    assert(
      property(array(itemArb, { minLength: 0, maxLength: 120 }), (items) => {
        const lists = buildListsFromItems(items);
        const summary = buildDashboardSummary(lists, items, 'all');

        expect(toCents(summary.totalCheckedPrice)).toBe(toCents(getTotalCheckedPrice(items)));
      }),
    );
  });

  it('should return empty dailySeries when buildItemVariations is called without daily series', () => {
    assert(
      property(array(titledPricedItemArb, { minLength: 1, maxLength: 80 }), (items) => {
        const variations = buildItemVariations(items, { includeDailySeries: false });

        for (const variation of variations) {
          expect(variation.dailySeries).toHaveLength(0);
        }
      }),
    );
  });
});
