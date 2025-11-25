'use server';

import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv';
import { configureSynced } from '@legendapp/state/sync';
import { configureSyncedSupabase, syncedSupabase } from '@legendapp/state/sync-plugins/supabase';
import { generateId } from './utils';
import { supabase } from '@/lib/supabase';

// Configure LegendApp Supabase sync
configureSyncedSupabase({
  generateId,
});

// Create a configured sync function
const customSynced = configureSynced(syncedSupabase, {
  persist: {
    plugin: ObservablePersistMMKV,
  },
  generateId,
  supabase,
  changesSince: 'last-sync',
  fieldCreatedAt: 'created_at',
  fieldUpdatedAt: 'updated_at',
  // Optionally enable soft deletes
  fieldDeleted: 'deleted',
});

// Get current user ID synchronously from cache or return empty
let cachedUserId = '';

// Initialize user ID
supabase.auth.getUser().then(({ data: { user } }) => {
  cachedUserId = user?.id || '';
});

export { cachedUserId, customSynced };
