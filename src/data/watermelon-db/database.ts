import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import schema from './schema';
import migrations from './migrations';
import Lists from './model/lists.model';
import Items from './model/list_items.model';
import Profiles from './model/profiles.model';

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
