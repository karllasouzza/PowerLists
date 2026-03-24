import type { ListItem } from '../types';
import { Decimal } from 'decimal.js';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const parsePrice = (price: string): number => {
  return parseFloat(price.replace(',', '.'));
};

export const parseAmount = (amount: string): number => {
  return parseFloat(amount.replace(',', '.'));
};

export const calculateTotal = (items: Pick<ListItem, 'price' | 'amount'>[]): string => {
  if (!items.length) {
    return formatCurrency(0);
  }

  const validItems = items.filter((item) => item.price != null && item.amount != null);

  if (!validItems.length) {
    return formatCurrency(0);
  }

  const total = validItems.reduce((accum, item) => {
    const price = new Decimal(item.price);
    const amount = new Decimal(item.amount);
    return accum.plus(price.times(amount));
  }, new Decimal(0));

  return formatCurrency(total.toNumber());
};
