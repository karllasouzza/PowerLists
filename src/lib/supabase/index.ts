// Type aliases for convenience
import type { Tables } from './database.types';

export { supabase } from './supabase';

export type {
  Tables,
  TablesInsert,
  TablesUpdate,
  Enums,
  CompositeTypes,
  Database,
} from './database.types';

export type ListRow = Tables<'lists'>;
export type ListItemRow = Tables<'list_items'>;
