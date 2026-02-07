export interface FormData {
  title: string;
  price?: string;
  amount?: string;
  color?: string;
  icon?: string;
}

export type Mode = 'add' | 'edit' | null;
