import { List } from '@/data/types';

export type ItemFormMode = 'listItem' | 'add' | 'edit';

export interface ItemFormData {
  readonly title: string;
  readonly price: string;
  readonly amount: string;
}

export interface ListItemsScreenProps {
  readonly navigation: any;
  readonly route: {
    readonly params: {
      readonly list: List;
    };
  };
}

export type ItemFormErrorField = 'title' | 'amount' | 'price';
