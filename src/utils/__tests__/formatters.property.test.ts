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
  it('parsePrice lida com cenarios reais de entrada', () => {
    expect(parsePrice('12,34')).toBe(12.34);
    expect(parsePrice('0,01')).toBe(0.01);
    expect(parsePrice('-12,34')).toBe(0);
    expect(parsePrice('')).toBe(0);
  });

  it('parseAmount lida com cenarios reais de entrada', () => {
    expect(parseAmount('10')).toBe(10);
    expect(parseAmount('0')).toBe(1);
    expect(parseAmount('-2')).toBe(1);
    expect(parseAmount('2,9')).toBe(3);
    expect(parseAmount('')).toBe(1);
  });

  it('calculateTotal soma corretamente em cenario de compra real', () => {
    const items: PriceAmount[] = [
      { price: 12.5, amount: 4 },
      { price: 0.99, amount: 3 },
      { price: null, amount: 2 },
      { price: 8.33, amount: null },
    ];

    const expected = formatCurrency(new Decimal(12.5).mul(4).plus(new Decimal(0.99).mul(3)));
    expect(calculateTotal(items)).toBe(expected);
  });

  it('parsePrice preserva precisao de centavos para entradas decimais', () => {
    assert(
      property(centsArb, (cents) => {
        const parsed = parsePrice(toBrPrice(cents));

        expect(Math.round(parsed * 100)).toBe(cents);
      }),
    );
  });

  it('parseAmount sempre retorna inteiro maior ou igual a 1', () => {
    assert(
      property(integer({ min: -10_000, max: 10_000 }), (input) => {
        const parsed = parseAmount(String(input));

        expect(Number.isInteger(parsed)).toBe(true);
        expect(parsed).toBeGreaterThanOrEqual(1);
      }),
    );
  });

  it('calculateTotal bate com oraculo Decimal para lotes aleatorios', () => {
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
