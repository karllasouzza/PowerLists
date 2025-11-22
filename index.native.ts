import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import schema from './src/services/watermelon-db/schema';
import migrations from './src/services/watermelon-db/migrations';
import Lists from '@/services/watermelon-db/model/lists.model';
import Items from '@/services/watermelon-db/model/list_items.model';
import Profiles from '@/services/watermelon-db/model/profiles.model';

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  dbName: 'powerlists',
  jsi: true,
  onSetUpError: (error) => {
    // TODO: logout and redirect to login screen
    console.error(error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [Profiles, Lists, Items],
});
