import { database } from '../watermelon-db/database';
import { supabase } from '@/lib/supabase';
import { synchronize, SyncDatabaseChangeSet } from '@nozbe/watermelondb/sync';

export class SyncService {
  private static instance: SyncService;

  private constructor() {}

  static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  async sync() {
    return synchronize({
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
  }
}

export const syncService = SyncService.getInstance();
