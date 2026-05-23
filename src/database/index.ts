import { Platform } from 'react-native';
import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';

import { schema } from './schema';
import migrations from './migrations';
import { Profile } from './models/Profile';
import { List } from './models/List';
import { ListItem } from './models/ListItem';

const adapter =
  Platform.OS === 'web'
    ? new LokiJSAdapter({
        schema,
        migrations,
        useWebWorker: false,
        useIncrementalIndexedDB: true,
      })
    : new SQLiteAdapter({
        schema,
        migrations,
        jsi: true,
        onSetUpError: (error) => {
          console.error('[DB] Setup error:', error);
        },
      });

export const database = new Database({
  adapter,
  modelClasses: [Profile, List, ListItem],
});
