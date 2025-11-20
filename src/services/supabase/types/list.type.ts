export interface listType {
  id: string;
  user_id: string;
  title: string;
  accent_color: string;
  icon: string;
  created_at: string;
  updated_at?: string;
}

export type AddNewListResult = {
  new_list: listType | null;
};

export type GetAllListsResults = {
  results: listType[] | null;
};

export type EditListResult = {
  edit_list: listType | null;
};
