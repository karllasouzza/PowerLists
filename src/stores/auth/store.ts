import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as Linking from 'expo-linking';

import { supabase } from '@/lib/supabase';
import { isGuestUser } from '@/data/types/user';
import { mmkvStorage } from '@/data/storage';
import { SyncService } from '@/services/sync';
import { showToast } from '@/services/toast';
import {
  getUser,
  createUser,
  updateUser,
  loginUser,
  syncUserWithSupabase,
  createGuestUser,
  softDeleteUser,
} from '@/data/actions/user';

import type { AuthStore } from './types';

const JSONStorageAdapterWithMMKV = createJSONStorage(() => mmkvStorage);

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isInitialized: false,
      isLoading: false,

      initialize: async () => {
        try {
          set({ isLoading: true });

          const { user } = get();

          if (user) {
            if (isGuestUser(user) && user.is_guest) {
              const currentUser = await getUser();
              set({
                user: currentUser.user,
                isInitialized: true,
                isLoading: false,
              });
              return;
            }

            const { data: sessionData } = await supabase.auth.getSession();

            if (sessionData.session) {
              const syncedUser = await syncUserWithSupabase({});
              if (syncedUser.user) {
                set({
                  user: syncedUser.user,
                  session: sessionData.session,
                  isInitialized: true,
                  isLoading: false,
                });
                return;
              }
            }

            const updatedUser = await updateUser({
              id: user.id,
              is_guest: true,
            });
            set({
              user: updatedUser.user,
              session: null,
              isInitialized: true,
              isLoading: false,
            });
            return;
          }

          set({
            user: null,
            session: null,
            isInitialized: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Erro ao inicializar autenticação:', error);
          // Fallback: retorna null
          set({
            user: null,
            session: null,
            isInitialized: true,
            isLoading: false,
          });
        }
      },

      signIn: async ({ email, password }) => {
        try {
          if (!email || !password) {
            throw new Error('Email and password are required');
          }

          set({ isLoading: true });

          const currentUser = get().user;

          const result = await loginUser(email, password);

          if (result.error) throw new Error(result.error);
          if (!result.user) throw new Error('Login failed');

          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (isGuestUser(currentUser) && currentUser.is_guest) {
            const syncService = new SyncService();
            await syncService.promptDataMigration(currentUser.id, result.user.id);
          }

          set({
            user: result.user,
            session,
            isLoading: false,
          });

          showToast({
            type: 'success',
            title: 'Sucesso!',
            subtitle: 'Login realizado com sucesso',
          });
          return true;
        } catch (error) {
          console.error('Error on signIn:', error);
          set({ isLoading: false });

          showToast({
            type: 'error',
            title: 'Erro ao conectar-se!',
            subtitle: error instanceof Error ? error.message : 'Email ou senha inválido!',
          });

          return false;
        }
      },

      signUp: async ({ email, password }) => {
        try {
          set({ isLoading: true });

          const currentUser = get().user;

          // Cria usuário usando função centralizada
          const result = await createUser({ email, password });

          if (!result.user) {
            throw new Error(result.error || 'Signup failed');
          }

          // Pega sessão do Supabase
          const { data: sessionData } = await supabase.auth.getSession();

          // Se tinha usuário guest, oferece migração
          if (isGuestUser(currentUser) && currentUser.is_guest) {
            const syncService = new SyncService();
            await syncService.promptDataMigration(currentUser.id, result.user.id);
          }

          set({
            user: result.user,
            session: sessionData.session,
            isLoading: false,
          });

          showToast({
            type: 'success',
            title: 'Sucesso!',
            subtitle: 'Conta criada com sucesso!',
          });
        } catch (error) {
          set({ isLoading: false });

          showToast({
            type: 'error',
            title: 'Erro ao criar conta!',
            subtitle: error instanceof Error ? error.message : 'Tente novamente mais tarde!',
          });

          throw error;
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true });

          const currentUser = get().user;

          await supabase.auth.signOut();

          if (currentUser) {
            const updatedUser = await softDeleteUser(currentUser.id);

            set({
              user: updatedUser.user,
              session: null,
            });
          } else {
            set({
              user: null,
              session: null,
            });
          }

          showToast({
            type: 'success',
            title: 'Sucesso!',
            subtitle: 'Sessão encerrada!',
          });
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
          set({ isLoading: false });
        }
      },

      sendResetPasswordByEmail: async ({ email }) => {
        try {
          set({ isLoading: true });

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
        } finally {
          set({ isLoading: false });
        }
      },

      resetPassword: async ({ password }) => {
        try {
          set({ isLoading: true });

          const { error } = await supabase.auth.updateUser({ password });

          if (error) throw error;

          showToast({
            type: 'success',
            title: 'Sucesso!',
            subtitle: 'Senha atualizada!',
          });
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
          set({ isLoading: false });
        }
      },

      checkSession: async () => {
        try {
          const { data } = await supabase.auth.getSession();

          if (data.session) {
            const {
              data: { user },
            } = await supabase.auth.getUser();

            if (user) {
              const syncedUser = await syncUserWithSupabase({ user });
              if (syncedUser.user) {
                set({
                  user: syncedUser.user,
                  session: data.session,
                });
              }
            }
          } else {
            const currentUser = get().user;
            if (currentUser) {
              const updatedUser = await updateUser({
                id: currentUser.id,
                is_guest: true,
              });
              set({
                user: updatedUser.user,
                session: null,
              });
            }
          }
        } catch (error) {
          console.error('Error checking session:', error);
        }
      },

      updateUser: async ({ updates }) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const result = await updateUser({
          id: currentUser.id,
          ...updates,
        });

        if (result.user) {
          set({ user: result.user });
        }
      },

      createGuest: async ({ name }) => {
        try {
          set({ isLoading: true });

          const result = await createGuestUser(name);

          if (!result.user) {
            throw new Error(result.error || 'Failed to create guest user');
          }

          set({
            user: result.user,
            session: null,
            isLoading: false,
          });

          return result.user;
        } catch (error) {
          set({ isLoading: false });
          console.error('Error creating guest user:', error);
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: JSONStorageAdapterWithMMKV,
      partialize: (state) => ({
        user: state.user,
        session: state.session,
      }),
    }
  )
);
