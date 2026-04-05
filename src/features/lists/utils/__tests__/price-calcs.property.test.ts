import type { ListItem } from '@/data/types';
import { describe, expect, it } from '@jest/globals';
import { Decimal } from 'decimal.js';
import { array, assert, boolean, integer, option, property, record, uuid } from 'fast-check';

import { calculateTotal } from '../price-calcs';

const centsArb = integer({ min: 0, max: 200_000 });
const priceArb = centsArb.map((cents) => new Decimal(cents).div(100).toNumber());
const amountArb = integer({ min: 0, max: 100 });

const listItemArb = record<ListItem>({
  id: uuid(),
  profileId: uuid(),
  listId: uuid(),
  title: option(
    integer({ min: 1, max: 999 }).map((value) => `item-${value}`),
    { nil: null },
  ),
  price: option(priceArb, { nil: null }),
  amount: option(amountArb, { nil: null }),
  isChecked: boolean(),
  createdAt: option(
    integer({ min: 1, max: 999_999 }).map(
      (value) => `2026-04-05T10:${String(value % 60).padStart(2, '0')}:00.000Z`,
    ),
    {
      nil: '2026-04-05T10:00:00.000Z',
    },
  ),
  updatedAt: option(
    integer({ min: 1, max: 999_999 }).map(
      (value) => `2026-04-05T11:${String(value % 60).padStart(2, '0')}:00.000Z`,
    ),
    {
      nil: null,
    },
  ),
  deleted: option(boolean(), { nil: null }),
});

describe('price-calcs.calculateTotal', () => {
  it('should calculate real purchase total in BRL', () => {
    const items: ListItem[] = [
      {
        id: '1',
        profileId: 'p1',
        listId: 'l1',
        title: 'Arroz',
        price: 12.5,
        amount: 2,
        isChecked: false,
        createdAt: '2026-04-05T10:00:00.000Z',
        updatedAt: null,
        deleted: null,
      },
      {
        id: '2',
        profileId: 'p1',
        listId: 'l1',
        title: 'Leite',
        price: 4.99,
        amount: 3,
        isChecked: false,
        createdAt: '2026-04-05T10:01:00.000Z',
        updatedAt: null,
        deleted: null,
      },
    ];

    expect(calculateTotal(items)).toBe('R$ 39,97');
  });

  it('should match Decimal oracle for random batches', () => {
    assert(
      property(array(listItemArb, { minLength: 0, maxLength: 80 }), (items) => {
        const expected = items
          .reduce((accum, item) => {
            return accum.plus(new Decimal(item.price ?? 0).mul(item.amount ?? 0));
          }, new Decimal(0))
          .toNumber();

        const brl = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(expected);

        expect(calculateTotal(items)).toBe(brl);
      }),
    );
  });
});
