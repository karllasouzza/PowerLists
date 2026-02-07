/**
 * Utilitários de formatação para items de lista
 */

import type { ListItem } from '../types';

/**
 * Formata um valor numérico para moeda brasileira (BRL)
 *
 * @param value - Valor a ser formatado
 * @returns String formatada como moeda
 */
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  });
};

/**
 * Converte string de preço para número
 * Remove vírgulas e converte para float
 *
 * @param price - Preço em formato string
 * @returns Número convertido
 */
export const parsePrice = (price: string): number => {
  return parseFloat(price.replace(',', '.'));
};

/**
 * Converte string de quantidade para número
 * Remove vírgulas e converte para float
 *
 * @param amount - Quantidade em formato string
 * @returns Número convertido
 */
export const parseAmount = (amount: string): number => {
  return parseFloat(amount.replace(',', '.'));
};

/**
 * Calcula o total de todos os items
 *
 * @param items - Array de items
 * @returns Total formatado como moeda ou 0 se não houver items
 */
export const calculateTotal = (items: ListItem[]): string => {
  if (!items.length) {
    return formatCurrency(0);
  }

  const total = items.reduce((accum, item) => {
    return accum + item.price * item.amount;
  }, 0);

  return formatCurrency(total);
};
