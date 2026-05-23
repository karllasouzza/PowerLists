import { synchronize } from '@nozbe/watermelondb/sync';
import { supabase } from '@/lib/supabase';
import { database } from './index';

let syncChannel: ReturnType<typeof supabase.channel> | null = null;
let isSyncing = false;

export async function syncDatabase(): Promise<void> {
  if (isSyncing) {
    return;
  }

  try {
    isSyncing = true;
    await synchronize({
      database,
      pullChanges: async ({ lastPulledAt }) => {
        const { data, error } = await (supabase.rpc as any)('pull', {
          last_pulled_at: lastPulledAt || 0,
        });
        if (error) throw new Error(error.message);
        const { changes, timestamp } = data as any;
        return { changes, timestamp };
      },
      pushChanges: async ({ changes }) => {
        const { error } = await (supabase.rpc as any)('push', { changes });
        if (error) throw new Error(error.message);
      },
      sendCreatedAsUpdated: true,
    });
  } finally {
    isSyncing = false;
  }
}

export function subscribeToRealtimeSync(): void {
  if (syncChannel) return;

  syncChannel = supabase
    .channel('db-changes')
    .on('postgres_changes', { event: '*', schema: 'public' }, () => {
      syncDatabase().catch((err) => {
        console.error('[Sync] Realtime sync failed:', err);
      });
    })
    .subscribe((status) => {
      console.log('[Sync] Realtime subscription status:', status);
    });
}

export function unsubscribeFromRealtimeSync(): void {
  if (syncChannel) {
    supabase.removeChannel(syncChannel);
    syncChannel = null;
  }
}
