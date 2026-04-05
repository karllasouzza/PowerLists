import { ListItem } from '@/data/types';
import { Decimal } from 'decimal.js';

export const formatCurrency = (value: number | Decimal): string => {
  const num = value instanceof Decimal ? value.toNumber() : value;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num);
};

export const parsePrice = (price: string): number => {
  try {
    const d = new Decimal(price.replace(',', '.') || '0');
    return d.isNaN() || d.isNegative() ? 0 : d.toDecimalPlaces(2).toNumber();
  } catch {
    return 0;
  }
};

export const parseAmount = (amount: string): number => {
  try {
    const d = new Decimal(amount.replace(',', '.') || '1').toDecimalPlaces(0);
    return d.lessThan(1) ? 1 : d.toNumber();
  } catch {
    return 1;
  }
};

export const calculateTotal = (items: Pick<ListItem, 'price' | 'amount'>[]): string => {
  if (!items.length) return formatCurrency(0);

  const validItems = items.filter((item) => item.price != null && item.amount != null);
  if (!validItems.length) return formatCurrency(0);

  const total = validItems.reduce((accum, item) => {
    const price = new Decimal(item.price ?? 0);
    const amount = new Decimal(item.amount ?? 0);
    return accum.plus(price.times(amount));
  }, new Decimal(0));

  return formatCurrency(total);
};
