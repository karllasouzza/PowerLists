export interface ItemType {
  id: string;
  title: string;
  price: number;
  amount: number;
  status: boolean;
}

export type GetItemsProps = {
  list_id: string;
};

export type GetItemsResult = {
  results: ItemType[] | null;
};

export type NewItemProps = {
  title: string;
  price: number;
  amount: number;
  list_id: string;
};

export type CheckItemProps = {
  id: string;
  status: boolean;
};

export type EditItemProps = {
  id: string;
  title: string;
  price: number;
  amount: number;
};

export type EditItemResult = {
  edit_item: ItemType | null;
};

export type DeleteItemsProps = {
  itemId: string;
};
