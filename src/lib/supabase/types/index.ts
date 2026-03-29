import type { Tables } from './database';

export type ListRow = Tables<'lists'>;
export type ListItemRow = Tables<'list_items'>;

export * from './database-custom-types';
export * from './database';
