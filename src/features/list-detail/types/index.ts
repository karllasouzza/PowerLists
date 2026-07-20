export type ItemFormMode = 'listItem' | 'add' | 'edit';

export interface ItemFormData {
  readonly title: string;
  readonly price: string;
  readonly amount: string;
}

export type ItemFormErrorField = 'title' | 'amount' | 'price';
