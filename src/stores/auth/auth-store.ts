import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthStore } from './auth.types';
import { UserType, isGuestUser } from '@/data/types/user.type';
import { supabase } from '@/lib/supabase';
import { storage } from '@/data/storage';
import { SyncService } from '@/services/sync/sync.service';
import { showToast } from '@/services/toast';
import {
  getUser,
  createUser,
  updateUser,
  loginUser,
  syncUserWithSupabase,
  createGuestUser,
} from '@/data/actions/user.actions';

/**
 * Adapter para usar MMKV com Zustand persist
 */
const mmkvStorage = createJSONStorage(() => ({
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    storage.remove(name);
  },
}));

/**
 * Store Zustand para gerenciamento de autenticação
 *
 * Features:
 * - Persistência no MMKV
 * - Sincronização com Supabase
 * - Migração de dados guest → authenticated
 * - Usa funções centralizadas de user.actions.ts
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      session: null,
      isInitialized: false,
      isLoading: false,

      /**
       * Inicializa o store
       * - Verifica se existe usuário no MMKV
       * - Se usuário for guest, mantém
       * - Se usuário for não-guest, revalida sessão Supabase
       * - Se não houver usuário, retorna null
       */
      initialize: async () => {
        try {
          set({ isLoading: true });

          const { user } = get();

          // Se já tem usuário carregado
          if (user) {
            // Se for GUEST: mantém guest (não verifica Supabase)
            if (isGuestUser(user) && user.is_guest) {
              const currentUser = await getUser();
              set({
                user: currentUser.user,
                isInitialized: true,
                isLoading: false,
              });
              return;
            }

            // Se for NÃO-GUEST: revalida no Supabase
            const { data: sessionData } = await supabase.auth.getSession();

            if (sessionData.session) {
              // Sessão válida: sincroniza dados do Supabase
              const syncedUser = await syncUserWithSupabase();
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

            // Sessão expirou: marca usuário atual como guest
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

          // Não tem usuário local: retorna null (não cria guest automaticamente)
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

      /**
       * Faz login com email e senha
       * Usa loginUser() de user.actions.ts
       */
      signIn: async (email: string, password: string) => {
        try {
          set({ isLoading: true });

          const currentUser = get().user;

          // Faz login usando função centralizada
          const result = await loginUser(email, password);

          if (!result.user) {
            throw new Error(result.error || 'Login failed');
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
            subtitle: 'Login realizado com sucesso',
          });
        } catch (error) {
          set({ isLoading: false });

          showToast({
            type: 'error',
            title: 'Erro ao conectar-se!',
            subtitle: error instanceof Error ? error.message : 'Email ou senha inválido!',
          });

          throw error;
        }
      },

      /**
       * Cria nova conta
       * Usa createUser() de user.actions.ts
       */
      signUp: async (name: string, email: string, password: string) => {
        try {
          set({ isLoading: true });

          const currentUser = get().user;

          // Cria usuário usando função centralizada
          const result = await createUser({ email, password, name });

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

      /**
       * Faz logout
       * Marca usuário atual como guest (não cria novo)
       */
      signOut: async () => {
        try {
          set({ isLoading: true });

          const currentUser = get().user;

          await supabase.auth.signOut();

          // Marca usuário atual como guest (se existir)
          if (currentUser) {
            const updatedUser = await updateUser({
              id: currentUser.id,
              is_guest: true,
            });

            set({
              user: updatedUser.user,
              session: null,
              isLoading: false,
            });
          } else {
            set({
              user: null,
              session: null,
              isLoading: false,
            });
          }

          showToast({
            type: 'success',
            title: 'Sucesso!',
            subtitle: 'Sessão encerrada!',
          });
        } catch (error) {
          set({ isLoading: false });

          showToast({
            type: 'error',
            title: 'Erro ao desconectar!',
            subtitle: 'Tente novamente mais tarde!',
          });

          throw error;
        }
      },

      /**
       * Envia email de recuperação de senha
       */
      resetPassword: async (email: string) => {
        try {
          set({ isLoading: true });

          const { error } = await supabase.auth.resetPasswordForEmail(email);

          if (error) throw error;

          set({ isLoading: false });

          showToast({
            type: 'success',
            title: 'Sucesso!',
            subtitle: 'Email de recuperação enviado!',
          });
        } catch (error) {
          set({ isLoading: false });

          showToast({
            type: 'error',
            title: 'Erro ao enviar email!',
            subtitle: 'Tente novamente mais tarde!',
          });

          throw error;
        }
      },

      /**
       * Verifica se existe sessão válida no Supabase
       * Usa syncUserWithSupabase() quando válida
       */
      checkSession: async () => {
        try {
          const { data } = await supabase.auth.getSession();

          if (data.session) {
            const { data: userData } = await supabase.auth.getUser();

            if (userData.user) {
              const syncedUser = await syncUserWithSupabase();
              if (syncedUser.user) {
                set({
                  user: syncedUser.user,
                  session: data.session,
                });
              }
            }
          } else {
            // Sessão expirou: marca como guest (não cria novo)
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
          console.error('Erro ao verificar sessão:', error);
        }
      },

      /**
       * Atualiza dados do usuário
       * Usa updateUser() de user.actions.ts
       */
      updateUser: async (updates: Partial<UserType>) => {
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

      /**
       * Cria um usuário guest
       * Função para ser chamada explicitamente pela UI
       */
      createGuest: async (name?: string) => {
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
      storage: mmkvStorage,
      partialize: (state) => ({
        user: state.user,
        session: state.session,
      }),
    }
  )
);
