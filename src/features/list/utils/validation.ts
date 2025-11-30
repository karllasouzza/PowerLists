/**
 * Utilitários de validação para items de lista
 */

import { showToast } from '@/services/toast';

/**
 * Valida o título de um item
 *
 * @param title - Título a ser validado
 * @returns true se válido, false caso contrário
 */
export const validateItemTitle = (title: string): boolean => {
  if (title.length < 3) {
    showToast({
      type: 'error',
      title: 'Título do produto inválido!',
      subtitle: 'O título tem que ter 3 ou mais caracteres!',
    });
    return false;
  }
  return true;
};

/**
 * Valida a quantidade de um item
 *
 * @param amount - Quantidade em formato string
 * @returns true se válido, false caso contrário
 */
export const validateItemAmount = (amount: string): boolean => {
  const parsedAmount = parseFloat(amount.replace(',', '.'));

  if (parsedAmount < 1) {
    showToast({
      type: 'error',
      title: 'Quantidade do produto inválida!',
      subtitle: 'A quantidade tem que ser maior que 0!',
    });
    return false;
  }
  return true;
};

/**
 * Valida todos os campos do formulário de item
 *
 * @param title - Título do item
 * @param amount - Quantidade do item
 * @returns Objeto com resultado da validação e campo com erro (se houver)
 */
export const validateItemForm = (
  title: string,
  amount: string
): { isValid: boolean; errorField: 'title' | 'amount' | '' } => {
  if (!validateItemTitle(title)) {
    return { isValid: false, errorField: 'title' };
  }

  if (!validateItemAmount(amount)) {
    return { isValid: false, errorField: 'amount' };
  }

  return { isValid: true, errorField: '' };
};
