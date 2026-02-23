import { configureSynced } from '@legendapp/state/sync';
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase';
import { generateId } from './utils';
import { supabase } from '@/lib/supabase';
import { auth$ } from '@/data/states/auth';
import { enableReactTracking } from '@legendapp/state/config/enableReactTracking';
import { MMKVPersistPluginWrapper } from './storage';

enableReactTracking({
  warnMissingUse: true,
});

export const customSynced = configureSynced(syncedSupabase, {
  supabase,
  persist: {
    plugin: MMKVPersistPluginWrapper,
  },
  generateId,
  mode: 'merge',
  as: 'Map',
  changesSince: 'last-sync',
  fieldCreatedAt: 'created_at',
  fieldUpdatedAt: 'updated_at',
  fieldDeleted: 'deleted',
});

export const getCurrentUserId = (): string | null => {
  const user = auth$.user.get();
  const id = user?.id || null;
  return id;
};
