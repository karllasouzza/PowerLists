import type { ListItem } from '@/data/types';
import { calculateTotal, formatCurrency, parseAmount, parsePrice } from '@/utils/formatters';
import { describe, expect, it } from '@jest/globals';
import { Decimal } from 'decimal.js';
import { array, assert, integer, option, property, record } from 'fast-check';

type PriceAmount = Pick<ListItem, 'price' | 'amount'>;

const centsArb = integer({ min: 0, max: 10_000_000 });
const amountArb = integer({ min: 0, max: 500 });
const nullablePriceArb = option(
  centsArb.map((cents) => new Decimal(cents).div(100).toNumber()),
  { nil: null },
);
const nullableAmountArb = option(amountArb, { nil: null });
const priceAmountArb = record<PriceAmount>({
  price: nullablePriceArb,
  amount: nullableAmountArb,
});

const toBrPrice = (cents: number): string => {
  return new Decimal(cents).div(100).toFixed(2).replace('.', ',');
};

describe('formatters', () => {
  it('should handle real-world input scenarios for parsePrice', () => {
    expect(parsePrice('12,34')).toBe(12.34);
    expect(parsePrice('0,01')).toBe(0.01);
    expect(parsePrice('-12,34')).toBe(0);
    expect(parsePrice('')).toBe(0);
  });

  it('should handle real-world input scenarios for parseAmount', () => {
    expect(parseAmount('10')).toBe(10);
    expect(parseAmount('0')).toBe(1);
    expect(parseAmount('-2')).toBe(1);
    expect(parseAmount('2,9')).toBe(3);
    expect(parseAmount('')).toBe(1);
  });

  it('should calculate total correctly in a real purchase scenario', () => {
    const items: PriceAmount[] = [
      { price: 12.5, amount: 4 },
      { price: 0.99, amount: 3 },
      { price: null, amount: 2 },
      { price: 8.33, amount: null },
    ];

    const expected = formatCurrency(new Decimal(12.5).mul(4).plus(new Decimal(0.99).mul(3)));
    expect(calculateTotal(items)).toBe(expected);
  });

  it('should preserve cent precision for decimal inputs in parsePrice', () => {
    assert(
      property(centsArb, (cents) => {
        const parsed = parsePrice(toBrPrice(cents));

        expect(Math.round(parsed * 100)).toBe(cents);
      }),
    );
  });

  it('should always return an integer greater than or equal to 1 for parseAmount', () => {
    assert(
      property(integer({ min: -10_000, max: 10_000 }), (input) => {
        const parsed = parseAmount(String(input));

        expect(Number.isInteger(parsed)).toBe(true);
        expect(parsed).toBeGreaterThanOrEqual(1);
      }),
    );
  });

  it('should match Decimal oracle for random batches', () => {
    assert(
      property(array(priceAmountArb, { minLength: 0, maxLength: 50 }), (items) => {
        const expectedTotal = items
          .filter((item) => item.price !== null && item.amount !== null)
          .reduce((accum, item) => {
            return accum.plus(new Decimal(item.price ?? 0).mul(item.amount ?? 0));
          }, new Decimal(0));

        expect(calculateTotal(items)).toBe(formatCurrency(expectedTotal));
      }),
    );
  });
});
