import type { Database as DatabaseGenerated } from './database';
import type { MergeDeep } from 'type-fest';

// Define custom types that match the database schema (snake_case)
// These override the generated types for better type safety

export type ListRow = {
  id: string;
  profile_id: string;
  title: string | null;
  accent_color: string | null;
  icon: string | null;
  created_at: string | null;
  updated_at: string | null;
  deleted: boolean | null;
};

export type ListItemRow = {
  id: string;
  profile_id: string;
  list_id: string;
  title: string | null;
  price: number | null;
  amount: number | null;
  is_checked: boolean;
  created_at: string | null;
  updated_at: string | null;
  deleted: boolean | null;
};

// Merge the generated database types with our custom types
export type DatabaseWithCustomTypes = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Tables: {
        lists: {
          Row: ListRow;
        };
        list_items: {
          Row: ListItemRow;
        };
      };
    };
  }
>;
