export interface ListItem {
  id: string;
  profileId: string;
  listId: string;
  title: string | null;
  price: number | null;
  amount: number | null;
  isChecked: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
  deleted?: boolean | null;
}

export type GetListItemsByListIdProps = {
  listId: string;
};

export type GetListItemsByListIdResult = {
  results: ListItem[] | null;
};

export type CreateListItemProps = Omit<ListItem, 'id' | 'createdAt' | 'updatedAt' | 'deleted'>;

export type CreateNewListItemResult = boolean;

export type UpdateListItemProps = Omit<ListItem, 'profileId' | 'listId' | 'createdAt'>;

export type UpdateListItemResult = boolean;

export type ToggleCheckListItemProps = {
  id: string;
  isChecked: boolean;
};

export type DeleteListItemProps = {
  itemId: string;
};
