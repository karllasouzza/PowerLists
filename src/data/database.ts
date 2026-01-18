import { configureSynced } from '@legendapp/state/sync';
import { configureSyncedSupabase, syncedSupabase } from '@legendapp/state/sync-plugins/supabase';
import { generateId } from './utils';
import { supabase } from '@/lib/supabase';
import { localUser$ } from './actions/user';
import { enableReactTracking } from '@legendapp/state/config/enableReactTracking';
import { storage } from './storage';
import type {
  ObservablePersistPlugin,
  PersistOptions,
  PersistMetadata,
} from '@legendapp/state/sync';

// Configure LegendApp Supabase sync
configureSyncedSupabase({
  generateId,
});

enableReactTracking({
  warnMissingUse: true,
});

interface Change {
  path: (string | number)[];
  valueAtPath: any;
  prevAtPath: any;
}

// Custom MMKV persist plugin using the existing storage instance
const mmkvPersistPlugin: ObservablePersistPlugin = {
  getTable<T = any>(table: string, init: object, config: PersistOptions): T {
    const key = config.name || table;
    const value = storage.getString(key);
    return value ? JSON.parse(value) : (init as T);
  },
  getMetadata(table: string, config: PersistOptions): PersistMetadata {
    const key = `${config.name || table}__metadata`;
    const value = storage.getString(key);
    return value ? JSON.parse(value) : {};
  },
  set(table: string, changes: Change[], config: PersistOptions): void {
    const key = config.name || table;
    const existing = storage.getString(key);
    let data = existing ? JSON.parse(existing) : {};

    for (const change of changes) {
      const { path, valueAtPath } = change;
      if (path.length === 0) {
        data = valueAtPath;
      } else {
        let current = data;
        for (let i = 0; i < path.length - 1; i++) {
          if (current[path[i]] === undefined) {
            current[path[i]] = {};
          }
          current = current[path[i]];
        }
        current[path[path.length - 1]] = valueAtPath;
      }
    }

    storage.set(key, JSON.stringify(data));
  },
  setMetadata(table: string, metadata: PersistMetadata, config: PersistOptions): Promise<void> {
    const key = `${config.name || table}__metadata`;
    storage.set(key, JSON.stringify(metadata));
    return Promise.resolve();
  },
  deleteTable(table: string, config: PersistOptions): void {
    const key = config.name || table;
    storage.remove(key);
  },
  deleteMetadata(table: string, config: PersistOptions): void {
    const key = `${config.name || table}__metadata`;
    storage.remove(key);
  },
};

// Create a configured sync function
export const customSynced = configureSynced(syncedSupabase, {
  persist: {
    plugin: mmkvPersistPlugin,
  },
  generateId,
  supabase,
  changesSince: 'last-sync',
  fieldCreatedAt: 'created_at',
  fieldUpdatedAt: 'updated_at',
  // Optionally enable soft deletes
  fieldDeleted: 'deleted',
});

/**
 * Retorna o ID do usuário atual do localUser$ observable
 * Substitui o antigo cachedUserId
 */
export const getCurrentUserId = (): string => {
  const user = localUser$.get();
  return user?.id || '';
};
