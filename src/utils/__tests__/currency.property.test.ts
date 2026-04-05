import { numberToBRLInput, formatBRL, parseBRLToNumber } from '@/utils/currency';
import { describe, expect, it } from '@jest/globals';
import { Decimal } from 'decimal.js';
import { assert, integer, property } from 'fast-check';

describe('currency', () => {
  it('should handle real-world BRL masking and parsing scenarios', () => {
    expect(formatBRL('12345')).toBe('R$ 123,45');
    expect(formatBRL('R$ 12a34')).toBe('R$ 12,34');
    expect(formatBRL('')).toBe('');

    expect(parseBRLToNumber('R$ 1.234,56')).toBe(1234.56);
    expect(parseBRLToNumber('R$ 0,01')).toBe(0.01);
    expect(parseBRLToNumber('')).toBe(0);

    expect(numberToBRLInput(1234.56)).toBe('R$ 1.234,56');
    expect(numberToBRLInput(0)).toBe('R$ 0,00');
  });

  it('should preserve cents when formatBRL is followed by parseBRLToNumber', () => {
    assert(
      property(integer({ min: 0, max: 10_000_000 }), (cents) => {
        const formatted = formatBRL(String(cents));
        const parsed = parseBRLToNumber(formatted);

        expect(Math.round(parsed * 100)).toBe(cents);
      }),
    );
  });

  it('should preserve cents when numberToBRLInput is followed by parseBRLToNumber', () => {
    assert(
      property(integer({ min: 0, max: 10_000_000 }), (cents) => {
        const value = new Decimal(cents).div(100).toNumber();
        const inputValue = numberToBRLInput(value);
        const parsed = parseBRLToNumber(inputValue);

        expect(Math.round(parsed * 100)).toBe(cents);
      }),
    );
  });
});
