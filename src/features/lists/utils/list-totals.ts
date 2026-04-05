import { Decimal } from 'decimal.js';

export type RawListItem = {
  list_id?: string;
  price?: number | null;
  amount?: number | null;
};

export const buildTotalsByListId = (items: RawListItem[]): Record<string, number> => {
  const totals: Record<string, Decimal> = {};

  for (const item of items) {
    const listId = item.list_id;
    if (!listId) continue;

    const price = item.price ?? 0;
    const amount = item.amount ?? 0;

    if (!Number.isFinite(price) || !Number.isFinite(amount)) {
      continue;
    }

    const accum = totals[listId] ?? new Decimal(0);
    totals[listId] = accum.plus(new Decimal(price).mul(amount));
  }

  return Object.entries(totals).reduce<Record<string, number>>((accum, [key, value]) => {
    accum[key] = value.toNumber();
    return accum;
  }, {});
};
