import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthStore, User } from './auth.types';
import { supabase } from '@/lib/supabase';
import { storage } from '@/data/storage';
import { generateUUID } from '@/utils/generate-uuid';
import { SyncService } from '@/services/sync/sync.service';
import { showToast } from '@/services/toast';

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
 * Cria um novo usuário guest
 */
const createGuestUser = (): User => ({
  id: generateUUID(),
  isGuest: true,
  createdAt: new Date().toISOString(),
});

/**
 * Converte usuário do Supabase para formato interno
 */
const convertSupabaseUser = (supabaseUser: any): User => ({
  id: supabaseUser.id,
  email: supabaseUser.email,
  name: supabaseUser.user_metadata?.name ?? supabaseUser.user_metadata?.full_name,
  avatarUrl: supabaseUser.user_metadata?.avatar_url,
  isGuest: false,
  createdAt: supabaseUser.created_at,
});

/**
 * Store Zustand para gerenciamento de autenticação
 *
 * Features:
 * - Criação automática de usuário guest
 * - Persistência no MMKV
 * - Sincronização com Supabase
 * - Migração de dados guest → authenticated
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
       * - Se não, cria um usuário guest
       * - Verifica se existe sessão válida no Supabase
       */
      initialize: async () => {
        try {
          set({ isLoading: true });

          const { user } = get();

          // Se já tem usuário carregado, apenas verifica sessão
          if (user) {
            if (!user.isGuest) {
              await get().checkSession();
            }
            // Sincroniza o userId com a camada de dados
            const { updateCachedUserId } = await import('@/data/database');
            updateCachedUserId(user.id);

            set({ isInitialized: true, isLoading: false });
            return;
          }

          // Tenta recuperar sessão do Supabase
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

          if (sessionData.session && !sessionError) {
            // Tem sessão válida, carrega usuário
            const { data: userData, error: userError } = await supabase.auth.getUser();

            if (userData.user && !userError) {
              const authenticatedUser = convertSupabaseUser(userData.user);

              // Sincroniza o userId com a camada de dados
              const { updateCachedUserId } = await import('@/data/database');
              updateCachedUserId(authenticatedUser.id);

              set({
                user: authenticatedUser,
                session: sessionData.session,
                isInitialized: true,
                isLoading: false,
              });
              return;
            }
          }

          // Não tem sessão válida, cria usuário guest
          const guestUser = createGuestUser();

          // Sincroniza o userId guest com a camada de dados
          const { updateCachedUserId } = await import('@/data/database');
          updateCachedUserId(guestUser.id);

          set({
            user: guestUser,
            session: null,
            isInitialized: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Erro ao inicializar autenticação:', error);
          // Em caso de erro, cria usuário guest
          const guestUser = createGuestUser();

          const { updateCachedUserId } = await import('@/data/database');
          updateCachedUserId(guestUser.id);

          set({
            user: guestUser,
            session: null,
            isInitialized: true,
            isLoading: false,
          });
        }
      },

      /**
       * Faz login com email e senha
       */
      signIn: async (email: string, password: string) => {
        try {
          set({ isLoading: true });

          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;
          if (!data.user || !data.session) {
            throw new Error('Dados de autenticação inválidos');
          }

          const currentUser = get().user;
          const newUser = convertSupabaseUser(data.user);

          // Atualiza o cachedUserId para sincronizar com LegendApp State
          const { updateCachedUserId } = await import('@/data/database');
          updateCachedUserId(newUser.id);

          // Se tinha usuário guest, oferece migração
          if (currentUser?.isGuest) {
            const syncService = new SyncService();
            await syncService.promptDataMigration(currentUser.id, newUser.id);
          }

          set({
            user: newUser,
            session: data.session,
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
       */
      signUp: async (name: string, email: string, password: string) => {
        try {
          set({ isLoading: true });

          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name,
              },
            },
          });

          if (error) throw error;
          if (!data.user || !data.session) {
            throw new Error('Dados de autenticação inválidos');
          }

          const currentUser = get().user;
          const newUser = convertSupabaseUser(data.user);

          // Atualiza o cachedUserId para sincronizar com LegendApp State
          const { updateCachedUserId } = await import('@/data/database');
          updateCachedUserId(newUser.id);

          // Se tinha usuário guest, oferece migração
          if (currentUser?.isGuest) {
            const syncService = new SyncService();
            await syncService.promptDataMigration(currentUser.id, newUser.id);
          }

          set({
            user: newUser,
            session: data.session,
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
       * Mantém dados locais, apenas remove sessão
       */
      signOut: async () => {
        try {
          set({ isLoading: true });

          await supabase.auth.signOut();

          // Cria novo usuário guest
          const guestUser = createGuestUser();

          // Atualiza o cachedUserId para o novo guest
          const { updateCachedUserId } = await import('@/data/database');
          updateCachedUserId(guestUser.id);

          set({
            user: guestUser,
            session: null,
            isLoading: false,
          });

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
       */
      checkSession: async () => {
        try {
          const { data, error } = await supabase.auth.getSession();

          if (error) throw error;

          if (data.session) {
            const { data: userData } = await supabase.auth.getUser();

            if (userData.user) {
              set({
                user: convertSupabaseUser(userData.user),
                session: data.session,
              });
            }
          } else {
            // Sessão expirou, volta para guest
            const guestUser = createGuestUser();
            set({
              user: guestUser,
              session: null,
            });
          }
        } catch (error) {
          console.error('Erro ao verificar sessão:', error);
        }
      },

      /**
       * Atualiza dados do usuário
       */
      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;

        set({
          user: {
            ...currentUser,
            ...updates,
          },
        });
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
