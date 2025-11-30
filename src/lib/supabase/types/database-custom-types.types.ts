import type { Database as DatabaseGenerated } from './database.types';
import type { MergeDeep } from 'type-fest';

// Define custom types that match the database schema (snake_case)
// These override the generated types for better type safety

export type ListRow = {
  id: string;
  profile_id: string;
  title: string;
  accent_color: string;
  icon: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
};

export type ListItemRow = {
  id: string;
  profile_id: string;
  lists_id: string;
  title: string;
  price?: number;
  amount: number;
  is_checked: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
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
