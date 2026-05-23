import { useSyncExternalStore } from 'react';

import { createGuest as createGuestAction, handleError, patchUser } from '@/database/operations/auth';
import { UserOperationResult, UserType } from '@/types/user';
import { supabase } from '@/lib/supabase';
import { getCurrentUser, setAuthState, subscribe } from '@/features/auth/authState';

export function useUser() {
  const user = useSyncExternalStore(subscribe, getCurrentUser);

  return {
    user,

    updateUser: async ({ updates }: { updates: Partial<UserType> }): Promise<void> => {
      const current = getCurrentUser();
      if (!current) return;

      const result = await patchUser({ id: current.id, ...updates });
      if (result.user) setAuthState({ user: result.user });
    },

    createGuest: async ({ name }: { name?: string }): Promise<UserType> => {
      try {
        const result = await createGuestAction(name);
        if (!result.user) throw new Error(result.error || 'Failed to create guest user');

        setAuthState({ user: result.user, session: null });
        return result.user;
      } catch (error) {
        console.error('Error creating guest user:', error);
        throw error;
      }
    },

    softDeleteUser: async (id: string): Promise<UserOperationResult> => {
      try {
        if (!id) throw new Error('User ID is required');

        const current = getCurrentUser();
        if (!current || current.id !== id) throw new Error('User not found or ID mismatch');

        const deletedAt = new Date().toISOString();
        const deleted = { ...current, deleted_at: deletedAt };
        setAuthState({ user: deleted });

        const isGuest = 'is_guest' in current && current.is_guest;
        if (!isGuest) {
          const { error } = await supabase.auth.updateUser({ data: { deleted_at: deletedAt } });
          if (error) console.error('Error soft deleting user in Supabase:', error);
        }

        return { user: deleted };
      } catch (error) {
        console.error('Error soft deleting user:', error);
        return { user: null, error: handleError('Unknown error', error) };
      }
    },

    hardDeleteUser: async (id: string): Promise<{ success: boolean; error?: string }> => {
      try {
        if (!id) throw new Error('User ID is required');

        const current = getCurrentUser();
        if (!current || current.id !== id) throw new Error('User not found or ID mismatch');

        const isGuest = 'is_guest' in current && current.is_guest;
        if (!isGuest) {
          const { error } = await supabase.functions.invoke('user-self-deletion');
          if (error) console.error('Error hard deleting user in Supabase:', error);
        }

        setAuthState({ user: null });
        return { success: true };
      } catch (error) {
        console.error('Error hard deleting user:', error);
        return { success: false, error: handleError('Unknown error', error) };
      }
    },
  };
}
