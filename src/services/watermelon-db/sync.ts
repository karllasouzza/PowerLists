import { supabase } from '@/lib/supabase';
import { SyncDatabaseChangeSet, synchronize } from '@nozbe/watermelondb/sync';
import { database } from '../../../index.native';

await synchronize({
  database,
  pullChanges: async ({ lastPulledAt }) => {
    try {
      const { data, error } = await supabase.rpc('pull', {
        last_pulled_at: lastPulledAt,
      });

      if (error) {
        throw error;
      }

      const { changes, timestamp } = data as {
        changes: SyncDatabaseChangeSet;
        timestamp: number;
      };

      return { changes, timestamp };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  pushChanges: async ({ changes }) => {
    try {
      const { error } = await supabase.rpc('push', { changes });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  sendCreatedAsUpdated: true,
});
