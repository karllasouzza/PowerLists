import { buildTotalsByListId, type RawListItem } from '@/features/lists/utils/list-totals';
import { describe, expect, it } from '@jest/globals';
import { Decimal } from 'decimal.js';
import { array, assert, integer, option, property, record, uuid } from 'fast-check';

const centsArb = integer({ min: 0, max: 200_000 });
const priceArb = centsArb.map((cents) => new Decimal(cents).div(100).toNumber());
const amountArb = integer({ min: 0, max: 100 });

const rawListItemArb = record<RawListItem>({
  list_id: option(uuid(), { nil: undefined }),
  price: option(priceArb, { nil: null }),
  amount: option(amountArb, { nil: null }),
});

const toCents = (value: number): number => {
  return Math.round(value * 100);
};

describe('buildTotalsByListId', () => {
  it('agrega totais por lista em cenario real', () => {
    const items: RawListItem[] = [
      { list_id: 'l1', price: 12.5, amount: 2 },
      { list_id: 'l1', price: 0.99, amount: 3 },
      { list_id: 'l2', price: 4.4, amount: 1 },
      { list_id: undefined, price: 10, amount: 1 },
      { list_id: 'l2', price: Number.POSITIVE_INFINITY, amount: 1 },
    ];

    const totals = buildTotalsByListId(items);

    expect(toCents(totals.l1 ?? 0)).toBe(
      toCents(new Decimal(12.5).mul(2).plus(new Decimal(0.99).mul(3)).toNumber()),
    );
    expect(toCents(totals.l2 ?? 0)).toBe(toCents(new Decimal(4.4).mul(1).toNumber()));
    expect(totals.undefined).toBeUndefined();
  });

  it('bate com oraculo Decimal para lotes aleatorios', () => {
    assert(
      property(array(rawListItemArb, { minLength: 0, maxLength: 150 }), (items) => {
        const actual = buildTotalsByListId(items);

        const expectedMap = new Map<string, Decimal>();
        for (const item of items) {
          const listId = item.list_id;
          const price = item.price ?? 0;
          const amount = item.amount ?? 0;

          if (!listId) {
            continue;
          }

          if (!Number.isFinite(price) || !Number.isFinite(amount)) {
            continue;
          }

          const current = expectedMap.get(listId) ?? new Decimal(0);
          expectedMap.set(listId, current.plus(new Decimal(price).mul(amount)));
        }

        expect(Object.keys(actual).sort()).toEqual([...expectedMap.keys()].sort());

        for (const [listId, expected] of expectedMap.entries()) {
          expect(toCents(actual[listId] ?? 0)).toBe(toCents(expected.toNumber()));
        }
      }),
    );
  });
});
