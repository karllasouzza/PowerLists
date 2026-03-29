import { ListItem } from '@/data/types';

export const calculateTotal = (items: ListItem[]) => {
  const prices = items.map((item: any) => item.price * item.amount);
  let total = 0;
  if (prices.length >= 1) {
    total = prices.reduce((accum: number, curr: number) => accum + curr, 0);
  } else {
    total = 0;
  }

  const priceFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return priceFormatter.format(total);
};
