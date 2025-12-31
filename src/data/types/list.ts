export interface ListType {
  id: string;
  profileId: string;
  title: string;
  accentColor: string;
  icon: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
}

export type CreateNewListProps = Omit<ListType, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export type CreateNewListResult = {
  newList: ListType | null;
};

export type UpdateListProps = Omit<ListType, 'profileId' | 'createdAt'>;

export type UpdateListResult = {
  editList: ListType | null;
};

export type GetAllListsProps = {
  profileId: string;
};

export type GetAllListsResults = {
  results: ListType[] | null;
};

export type DeleteListProps = {
  id: string;
};
