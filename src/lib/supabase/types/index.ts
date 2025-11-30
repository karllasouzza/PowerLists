import type { Tables } from './database.types';

export type ListRow = Tables<'lists'>;
export type ListItemRow = Tables<'list_items'>;

export * from './database-custom-types.types';
export * from './database.types';
