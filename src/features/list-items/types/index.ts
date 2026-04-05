/**
 * Tipos para a feature de List Items
 */

import { List } from '@/data/types';

/**
 * Representa um item de lista
 */
export interface ListItem {
  readonly id: string;
  readonly title: string;
  readonly price: number;
  readonly amount: number;
  readonly isChecked: boolean;
  readonly createdAt?: string | Date;
  readonly updatedAt?: string | Date;
  readonly listId: string;
  readonly profileId: string;
}

/**
 * Modos de operação do formulário de item
 */
export type ItemFormMode = 'listItem' | 'add' | 'edit';

/**
 * Dados do formulário de item
 */
export interface ItemFormData {
  readonly title: string;
  readonly price: string;
  readonly amount: string;
}

/**
 * Props para a tela de items
 */
export interface ListItemsScreenProps {
  readonly navigation: any;
  readonly route: {
    readonly params: {
      readonly list: List;
    };
  };
}

/**
 * Campos que podem ter erro no formulário
 */
export type ItemFormErrorField = 'title' | 'amount' | '';
