export interface ListItemType {
  id: string;
  profileId: string;
  listId: string;
  title: string;
  price?: number;
  amount: number;
  isChecked: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type GetListItemsByListIdProps = {
  listId: string;
};

export type GetListItemsByListIdResult = {
  results: ListItemType[] | null;
};

export type CreateListItemProps = Omit<
  ListItemType,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type CreateNewListItemResult = boolean;

export type UpdateListItemProps = Omit<ListItemType, 'profileId' | 'listId' | 'createdAt'>;

export type UpdateListItemResult = boolean;

export type ToggleCheckListItemProps = {
  id: string;
  isChecked: boolean;
};

export type DeleteListItemProps = {
  itemId: string;
};
