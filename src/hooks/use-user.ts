import { useValue } from '@legendapp/state/react';

import { createGuest as createGuestAction, handleError, patchUser } from '@/data/actions/auth';
import { auth$ } from '@/data/states/auth';
import { UserOperationResult, UserType } from '@/data/types/user';
import { supabase } from '@/lib/supabase';

export function useUser() {
  const user = useValue(auth$.user);

  return {
    user,

    updateUser: async ({ updates }: { updates: Partial<UserType> }): Promise<void> => {
      const current = auth$.user.get();
      if (!current) return;

      const result = await patchUser({ id: current.id, ...updates });
      if (result.user) auth$.user.set(result.user);
    },

    createGuest: async ({ name }: { name?: string }): Promise<UserType> => {
      try {
        auth$.isLoading.set(true);
        const result = await createGuestAction(name);
        if (!result.user) throw new Error(result.error || 'Failed to create guest user');

        auth$.user.set(result.user);
        auth$.session.set(null);
        auth$.isLoading.set(false);
        return result.user;
      } catch (error) {
        auth$.isLoading.set(false);
        console.error('Error creating guest user:', error);
        throw error;
      }
    },

    softDeleteUser: async (id: string): Promise<UserOperationResult> => {
      try {
        if (!id) throw new Error('User ID is required');

        const current = auth$.user.get();
        if (!current || current.id !== id) throw new Error('User not found or ID mismatch');

        const deletedAt = new Date().toISOString();
        const deleted = { ...current, deleted_at: deletedAt };
        auth$.user.set(deleted);

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

        const current = auth$.user.get();
        if (!current || current.id !== id) throw new Error('User not found or ID mismatch');

        const isGuest = 'is_guest' in current && current.is_guest;
        if (!isGuest) {
          const { error } = await supabase.functions.invoke('user-self-deletion');
          if (error) console.error('Error hard deleting user in Supabase:', error);
        }

        auth$.user.set(null);
        return { success: true };
      } catch (error) {
        console.error('Error hard deleting user:', error);
        return { success: false, error: handleError('Unknown error', error) };
      }
    },
  };
}
