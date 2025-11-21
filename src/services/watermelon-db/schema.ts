import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'lists',
      columns: [
        { name: 'user_id', type: 'string', isOptional: true },
        { name: 'title', type: 'string', isOptional: true },
        { name: 'accent_color', type: 'string', isOptional: true },
        { name: 'icon', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'list_item',
      columns: [
        { name: 'title', type: 'string', isOptional: true },
        { name: 'price', type: 'number', isOptional: true },
        { name: 'status', type: 'boolean', isOptional: true },
        { name: 'amount', type: 'number', isOptional: true },
        { name: 'list_id', type: 'string', isIndexed: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
});
