export interface List {
  id: string;
  title: string;
  accentColor: string;
  icon: string;
  background?: string;
  color?: string;
  iconBackground?: string;
}

export interface FormData {
  title: string;
  price?: string;
  amount?: string;
  color?: string;
  icon?: string;
}

export type Mode = 'add' | 'edit' | null;

export interface HomeScreenProps {
  navigation: any;
}
