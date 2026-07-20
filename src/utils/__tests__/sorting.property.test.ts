import * as fc from 'fast-check';
import { sortItems, sortItemsByName, sortItemsByPrice, sortItemsByDate } from '../sorting';
import type { ListItem } from '@/types';

const listItemArbitrary = fc.record({
  id: fc.string({ minLength: 1, maxLength: 10 }),
  listId: fc.string({ minLength: 1, maxLength: 10 }),
  profileId: fc.string({ minLength: 1, maxLength: 10 }),
  title: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: null }),
  price: fc.option(fc.float({ min: 0, max: 1000 }), { nil: null }),
  amount: fc.option(fc.integer({ min: 1, max: 100 }), { nil: null }),
  isChecked: fc.boolean(),
  createdAt: fc.constantFrom('2024-01-01T00:00:00Z', '2024-06-15T12:00:00Z', '2024-12-31T23:59:59Z'),
  updatedAt: fc.constant(undefined),
});

describe('sortItems', () => {
  describe('sortItemsByName', () => {
    it('should sort items alphabetically by title', () => {
      const items: ListItem[] = [
        { id: '1', listId: 'l1', profileId: 'p1', title: 'Banana', price: 5, amount: 1, isChecked: false, createdAt: '2024-01-01' },
        { id: '2', listId: 'l1', profileId: 'p1', title: 'Abacaxi', price: 3, amount: 1, isChecked: false, createdAt: '2024-01-01' },
        { id: '3', listId: 'l1', profileId: 'p1', title: 'Laranja', price: 4, amount: 1, isChecked: false, createdAt: '2024-01-01' },
      ];

      const sorted = sortItemsByName(items);
      expect(sorted.map((i) => i.title)).toEqual(['Abacaxi', 'Banana', 'Laranja']);
    });

    it('should handle null titles (treated as empty string)', () => {
      const items: ListItem[] = [
        { id: '1', listId: 'l1', profileId: 'p1', title: null, price: 5, amount: 1, isChecked: false, createdAt: '2024-01-01' },
        { id: '2', listId: 'l1', profileId: 'p1', title: 'Abacaxi', price: 3, amount: 1, isChecked: false, createdAt: '2024-01-01' },
      ];

      const sorted = sortItemsByName(items);
      // Empty string sorts before "Abacaxi" in locale comparison
      expect(sorted[0].title).toBeNull();
      expect(sorted[1].title).toBe('Abacaxi');
    });

    it('should not mutate original array', () => {
      const items: ListItem[] = [
        { id: '1', listId: 'l1', profileId: 'p1', title: 'Banana', price: 5, amount: 1, isChecked: false, createdAt: '2024-01-01' },
        { id: '2', listId: 'l1', profileId: 'p1', title: 'Abacaxi', price: 3, amount: 1, isChecked: false, createdAt: '2024-01-01' },
      ];

      const original = [...items];
      sortItemsByName(items);
      expect(items).toEqual(original);
    });
  });

  describe('sortItemsByPrice', () => {
    it('should sort items by price ascending', () => {
      const items: ListItem[] = [
        { id: '1', listId: 'l1', profileId: 'p1', title: 'A', price: 10, amount: 1, isChecked: false, createdAt: '2024-01-01' },
        { id: '2', listId: 'l1', profileId: 'p1', title: 'B', price: 5, amount: 1, isChecked: false, createdAt: '2024-01-01' },
        { id: '3', listId: 'l1', profileId: 'p1', title: 'C', price: 15, amount: 1, isChecked: false, createdAt: '2024-01-01' },
      ];

      const sorted = sortItemsByPrice(items);
      expect(sorted.map((i) => i.price)).toEqual([5, 10, 15]);
    });

    it('should handle null prices as 0', () => {
      const items: ListItem[] = [
        { id: '1', listId: 'l1', profileId: 'p1', title: 'A', price: null, amount: 1, isChecked: false, createdAt: '2024-01-01' },
        { id: '2', listId: 'l1', profileId: 'p1', title: 'B', price: 10, amount: 1, isChecked: false, createdAt: '2024-01-01' },
      ];

      const sorted = sortItemsByPrice(items);
      expect(sorted[0].price).toBeNull();
      expect(sorted[1].price).toBe(10);
    });
  });

  describe('sortItemsByDate', () => {
    it('should sort items by creation date ascending', () => {
      const items: ListItem[] = [
        { id: '1', listId: 'l1', profileId: 'p1', title: 'A', price: 5, amount: 1, isChecked: false, createdAt: '2024-06-15' },
        { id: '2', listId: 'l1', profileId: 'p1', title: 'B', price: 5, amount: 1, isChecked: false, createdAt: '2024-01-01' },
        { id: '3', listId: 'l1', profileId: 'p1', title: 'C', price: 5, amount: 1, isChecked: false, createdAt: '2024-12-31' },
      ];

      const sorted = sortItemsByDate(items);
      expect(sorted.map((i) => i.id)).toEqual(['2', '1', '3']);
    });

    it('should handle early dates as 0', () => {
      const items: ListItem[] = [
        { id: '1', listId: 'l1', profileId: 'p1', title: 'A', price: 5, amount: 1, isChecked: false, createdAt: '1970-01-01' },
        { id: '2', listId: 'l1', profileId: 'p1', title: 'B', price: 5, amount: 1, isChecked: false, createdAt: '2024-01-01' },
      ];

      const sorted = sortItemsByDate(items);
      expect(sorted[0].id).toBe('1');
      expect(sorted[1].id).toBe('2');
    });
  });

  describe('sortItems with mode', () => {
    it('should use date sorting for default mode', () => {
      const items: ListItem[] = [
        { id: '1', listId: 'l1', profileId: 'p1', title: 'B', price: 10, amount: 1, isChecked: false, createdAt: '2024-06-15' },
        { id: '2', listId: 'l1', profileId: 'p1', title: 'A', price: 5, amount: 1, isChecked: false, createdAt: '2024-01-01' },
      ];

      const sorted = sortItems(items, 'default');
      expect(sorted.map((i) => i.id)).toEqual(['2', '1']);
    });

    it('should use name sorting for az mode', () => {
      const items: ListItem[] = [
        { id: '1', listId: 'l1', profileId: 'p1', title: 'Banana', price: 5, amount: 1, isChecked: false, createdAt: '2024-01-01' },
        { id: '2', listId: 'l1', profileId: 'p1', title: 'Abacaxi', price: 5, amount: 1, isChecked: false, createdAt: '2024-01-01' },
      ];

      const sorted = sortItems(items, 'az');
      expect(sorted.map((i) => i.title)).toEqual(['Abacaxi', 'Banana']);
    });

    it('should use price sorting for price mode', () => {
      const items: ListItem[] = [
        { id: '1', listId: 'l1', profileId: 'p1', title: 'A', price: 10, amount: 1, isChecked: false, createdAt: '2024-01-01' },
        { id: '2', listId: 'l1', profileId: 'p1', title: 'B', price: 5, amount: 1, isChecked: false, createdAt: '2024-01-01' },
      ];

      const sorted = sortItems(items, 'price');
      expect(sorted.map((i) => i.price)).toEqual([5, 10]);
    });
  });

  describe('property-based: sortItemsByName maintains length', () => {
    it('should return same number of items', () => {
      fc.assert(
        fc.property(fc.array(listItemArbitrary, { maxLength: 20 }), (items) => {
          const sorted = sortItemsByName(items);
          expect(sorted.length).toBe(items.length);
        }),
      );
    });
  });

  describe('property-based: sortItemsByPrice maintains length', () => {
    it('should return same number of items', () => {
      fc.assert(
        fc.property(fc.array(listItemArbitrary, { maxLength: 20 }), (items) => {
          const sorted = sortItemsByPrice(items);
          expect(sorted.length).toBe(items.length);
        }),
      );
    });
  });

  describe('property-based: sortItemsByDate maintains length', () => {
    it('should return same number of items', () => {
      fc.assert(
        fc.property(fc.array(listItemArbitrary, { maxLength: 20 }), (items) => {
          const sorted = sortItemsByDate(items);
          expect(sorted.length).toBe(items.length);
        }),
      );
    });
  });
});
