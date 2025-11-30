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

/**
 * ID do usuário atual (guest ou authenticated)
 * Este valor é atualizado pelo auth store
 */
let cachedUserId = '';

/**
 * Atualiza o ID do usuário atual
 * Deve ser chamado pelo auth store quando o usuário faz login/logout
 *
 * @param userId - ID do usuário (guest UUID ou Supabase ID)
 */
export const updateCachedUserId = (userId: string): void => {
  cachedUserId = userId;
};

/**
 * Retorna o ID do usuário atual
 */
export const getCachedUserId = (): string => {
  return cachedUserId;
};

/**
 * Inicializa o userId a partir do Supabase (se existir sessão)
 * Caso contrário, mantém vazio para ser preenchido pelo guest user
 */
supabase.auth.getUser().then(({ data: { user } }) => {
  if (user?.id) {
    cachedUserId = user.id;
  }
});

export { cachedUserId, customSynced };
