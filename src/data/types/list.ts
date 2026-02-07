import { ListItem } from '@/features/list_items';

export interface List {
  id: string;
  title: string;
  accentColor: string;
  icon: string;
  background?: string;
  color?: string;
  iconBackground?: string;
  profileId: string;
  listItems?: Pick<ListItem, 'isChecked' | 'amount' | 'price'>[];
  createdAt: string | Date;
  updatedAt?: string | Date;
  deleted?: boolean | null;
}

export type CreateNewListProps = Omit<List, 'id' | 'createdAt' | 'updatedAt' | 'deleted'>;

export type CreateNewListResult = {
  newList: List | null;
};

export type UpdateListProps = Omit<List, 'profileId' | 'createdAt'>;

export type UpdateListResult = {
  editList: List | null;
};

export type GetAllListsProps = {
  profileId: string;
};

export type GetAllListsResults = {
  results: List[] | null;
};

export type DeleteListProps = {
  id: string;
};
