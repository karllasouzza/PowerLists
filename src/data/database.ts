import { configureSynced } from '@legendapp/state/sync';
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase';
import { generateId } from './utils';
import { supabase } from '@/lib/supabase';
import { auth$ } from '@/data/states/auth';
import { enableReactTracking } from '@legendapp/state/config/enableReactTracking';
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv';

enableReactTracking({
  warnMissingUse: true,
});

export const supabaseSynced = configureSynced(syncedSupabase, {
  supabase,
  persist: {
    plugin: ObservablePersistMMKV,
    retrySync: true,
  },
  generateId,
  mode: 'merge',
  as: 'Map',
  changesSince: 'last-sync',
  fieldCreatedAt: 'created_at',
  fieldUpdatedAt: 'updated_at',
  fieldDeleted: 'deleted',
  retry: {
    infinite: true,
  },
});

export const getCurrentUserId = (): string | null => {
  const user = auth$.user.get();
  const id = user?.id || null;
  return id;
};
