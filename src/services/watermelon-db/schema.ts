import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'profiles',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'avatar_url', type: 'string' },
        { name: 'bio', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
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
      ],
    }),
    tableSchema({
      name: 'list_items',
      columns: [
        { name: 'profile_id', type: 'string', isIndexed: true },
        { name: 'list_id', type: 'string', isIndexed: true },
        { name: 'title', type: 'string' },
        { name: 'price', type: 'number', isOptional: true },
        { name: 'amount', type: 'number' },
        { name: 'is_checked', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
});
