import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: 'profiles',
      columns: [
        { name: 'user_id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'avatar_url', type: 'string', isOptional: true },
        { name: 'bio', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'deleted_at', type: 'number', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'lists',
      columns: [
        { name: 'profile_id', type: 'string', isIndexed: true },
        { name: 'title', type: 'string' },
        { name: 'accent_color', type: 'string' },
        { name: 'icon', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'deleted_at', type: 'number', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'list_items',
      columns: [
        { name: 'profile_id', type: 'string', isIndexed: true },
        { name: 'list_id', type: 'string', isIndexed: true },
        { name: 'title', type: 'string', isOptional: true },
        { name: 'price', type: 'number', isOptional: true },
        { name: 'amount', type: 'number', isOptional: true },
        { name: 'is_checked', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'deleted_at', type: 'number', isOptional: true },
      ],
    }),
  ],
});
