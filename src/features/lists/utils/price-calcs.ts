import { ListItem } from '@/data/types';
import { Decimal } from 'decimal.js';

export const calculateTotal = (items: ListItem[]) => {
  const total = items
    .reduce((accum, item) => {
      return accum.plus(new Decimal(item.price ?? 0).mul(item.amount ?? 0));
    }, new Decimal(0))
    .toNumber();

  const priceFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return priceFormatter.format(total);
};
