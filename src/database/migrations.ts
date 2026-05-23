import { schemaMigrations, unsafeExecuteSql } from '@nozbe/watermelondb/Schema/migrations';

export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        unsafeExecuteSql(
          'ALTER TABLE profiles DROP COLUMN last_modified_at; ' +
            'ALTER TABLE lists DROP COLUMN last_modified_at; ' +
            'ALTER TABLE list_items DROP COLUMN last_modified_at;',
        ),
      ],
    },
  ],
});
