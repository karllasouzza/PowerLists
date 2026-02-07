import { clearAllStorage } from '@/data/storage';
import { isGuestUser, UserType, UserOperationResult } from '@/data/types/user';
import { supabase } from '@/lib/supabase';
import { SyncService, showToast } from '@/services';
import {
  fetchOrRestoreUser,
  syncWithSupabase,
  patchUser,
  signInWithPassword,
  handleError,
  createSupabaseUser,
  performSignOut,
  createGuest,
} from '@/data/actions/auth';
import { useValue } from '@legendapp/state/react';
import * as Linking from 'expo-linking';
import { auth$ } from '@/data/states/auth';

export function useAuthStore() {
  const user = useValue(auth$.user);
  const session = useValue(auth$.session);
  const isInitialized = useValue(auth$.isInitialized);
  const isLoading = useValue(auth$.isLoading);

  return {
    // state
    user,
    session,
    isInitialized,
    isLoading,

    // actions
    initialize: async (): Promise<boolean> => {
      try {
        auth$.isLoading.set(true);

        const current = auth$.user.get();
        if (!current) throw new Error('No user found in store');

        if (isGuestUser(current) && current.is_guest) {
          const result = await fetchOrRestoreUser();
          auth$.user.set(result.user);
          auth$.isInitialized.set(true);
          auth$.isLoading.set(false);
          return true;
        }

        const { data: sessionData } = await supabase.auth.getSession();

        if (sessionData.session) {
          const synced = await syncWithSupabase();
          if (synced.user) {
            auth$.user.set(synced.user);
            auth$.session.set(sessionData.session);
            auth$.isInitialized.set(true);
            auth$.isLoading.set(false);
            return true;
          }
        }

        const updated = await patchUser({ id: current.id, is_guest: true });
        auth$.user.set(updated.user);
        auth$.session.set(null);
        auth$.isInitialized.set(true);
        auth$.isLoading.set(false);
        return true;
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        auth$.user.set(null);
        auth$.session.set(null);
        auth$.isInitialized.set(true);
        auth$.isLoading.set(false);
        return false;
      }
    },

    signIn: async ({ email, password }: { email: string; password: string }): Promise<boolean> => {
      try {
        if (!email || !password) throw new Error('Email and password are required');

        auth$.isLoading.set(true);
        const previousUser = auth$.user.get();

        const result = await signInWithPassword(email, password);
        if (result.error) throw new Error(result.error);
        if (!result.user) throw new Error('Login failed');

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (isGuestUser(previousUser) && previousUser.is_guest) {
          const syncService = new SyncService();
          await syncService.promptDataMigration({
            guestId: previousUser.id,
            userId: result.user.id,
          });
        }

        auth$.user.set(result.user);
        auth$.session.set(session);
        auth$.isLoading.set(false);

        showToast({ type: 'success', title: 'Sucesso!', subtitle: 'Login realizado com sucesso' });
        return true;
      } catch (error) {
        console.error('Error on signIn:', error);
        auth$.isLoading.set(false);
        showToast({
          type: 'error',
          title: 'Erro ao conectar-se!',
          subtitle: handleError('Email ou senha inválido!', error),
        });
        return false;
      }
    },

    signUp: async ({ email, password }: { email: string; password: string }): Promise<void> => {
      try {
        auth$.isLoading.set(true);
        const previousUser = auth$.user.get();

        const result = await createSupabaseUser({ email, password });
        if (!result.user) throw new Error(result.error || 'Signup failed');

        const { data: sessionData } = await supabase.auth.getSession();

        if (isGuestUser(previousUser) && previousUser.is_guest) {
          const syncService = new SyncService();
          await syncService.promptDataMigration({
            guestId: previousUser.id,
            userId: result.user.id,
          });
        }

        auth$.user.set(result.user);
        auth$.session.set(sessionData.session);
        auth$.isLoading.set(false);

        showToast({ type: 'success', title: 'Sucesso!', subtitle: 'Conta criada com sucesso!' });
      } catch (error) {
        auth$.isLoading.set(false);
        showToast({
          type: 'error',
          title: 'Erro ao criar conta!',
          subtitle: handleError('Tente novamente mais tarde!', error),
        });
        throw error;
      }
    },

    signOut: async (): Promise<boolean> => {
      try {
        auth$.isLoading.set(true);
        await performSignOut();
        clearAllStorage();
        auth$.user.set(null);
        auth$.session.set(null);
        showToast({ type: 'success', title: 'Sucesso!', subtitle: 'Sessão encerrada!' });
        return true;
      } catch (error) {
        console.error('Error on signOut:', error);
        showToast({
          type: 'error',
          title: 'Erro ao desconectar!',
          subtitle: 'Tente novamente mais tarde!',
        });
        return false;
      } finally {
        auth$.isLoading.set(false);
      }
    },

    sendResetPasswordByEmail: async ({ email }: { email: string }): Promise<boolean> => {
      try {
        const redirectUrl = Linking.createURL('password-recovery');
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectUrl,
        });
        if (error) throw error;

        showToast({
          type: 'success',
          title: 'Sucesso!',
          subtitle: 'Email de recuperação enviado!',
        });
        return true;
      } catch (error) {
        console.error('Error sending reset password email:', error);
        showToast({
          type: 'error',
          title: 'Erro ao enviar email!',
          subtitle: 'Tente novamente mais tarde!',
        });
        return false;
      }
    },

    resetPassword: async ({ password }: { password: string }): Promise<boolean> => {
      try {
        auth$.isLoading.set(true);
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;

        showToast({ type: 'success', title: 'Sucesso!', subtitle: 'Senha atualizada!' });
        return true;
      } catch (error) {
        console.error(error);
        showToast({
          type: 'error',
          title: 'Erro ao atualizar senha!',
          subtitle: 'Tente novamente mais tarde!',
        });
        return false;
      } finally {
        auth$.isLoading.set(false);
      }
    },

    checkSession: async (): Promise<void> => {
      try {
        const { data } = await supabase.auth.getSession();

        if (data.session) {
          const {
            data: { user: supaUser },
          } = await supabase.auth.getUser();

          if (supaUser) {
            const synced = await syncWithSupabase(supaUser);
            if (synced.user) {
              auth$.user.set(synced.user);
              auth$.session.set(data.session);
            }
          }
        } else {
          const current = auth$.user.get();
          if (current) {
            const updated = await patchUser({ id: current.id, is_guest: true });
            auth$.user.set(updated.user);
            auth$.session.set(null);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    },

    updateUser: async ({ updates }: { updates: Partial<UserType> }): Promise<void> => {
      const current = auth$.user.get();
      if (!current) return;

      const result = await patchUser({ id: current.id, ...updates });
      if (result.user) auth$.user.set(result.user);
    },

    createGuest: async ({ name }: { name?: string }): Promise<UserType> => {
      try {
        auth$.isLoading.set(true);
        const result = await createGuest(name);
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
