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

export type CreateListItemProps = Omit<
  ListItemType,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type CreateNewListItemResult = {
  newListItem: ListItemType | null;
};

export type UpdateListItemProps = Omit<ListItemType, 'profileId' | 'listId' | 'createdAt'>;

export type UpdateListItemResult = {
  editItem: ListItemType | null;
};

export type GetListItemsProps = {
  listId: string;
};

export type GetListItemsResult = {
  results: ListItemType[] | null;
};

export type CheckListItemProps = {
  id: string;
  isChecked: boolean;
};

export type DeleteListItemProps = {
  itemId: string;
};
