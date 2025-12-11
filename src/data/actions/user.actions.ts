import { observable } from '@legendapp/state';
import { supabase } from '@/lib/supabase';
import { generateId } from '../utils';
import type {
  UserType,
  UserGuestType,
  CreateUserParams,
  UpdateUserParams,
  UserOperationResult,
} from '../types/user.type';
import { AuthError } from '@supabase/supabase-js';

/**
 * Observable para usuário local (fonte única de verdade)
 * Sincronizado com MMKV e Supabase
 */
export const localUser$ = observable<UserType>(null);

// Initialize observable
localUser$.get();

/**
 * Obtém o usuário atual
 * Prioridade: localUser$ → Supabase → null
 */
export const getUser = async (): Promise<UserOperationResult> => {
  try {
    // 1. Verifica localUser$ primeiro
    const userData = localUser$.get();
    if (userData) {
      return { user: userData };
    }

    // 2. Se não tem local, verifica Supabase
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    if (supabaseUser) {
      // Sincroniza com local
      localUser$.set(supabaseUser);
      return { user: supabaseUser };
    }

    return { user: null };
  } catch (error) {
    console.error('Error getting user:', error);
    return { user: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Cria um novo usuário (guest ou autenticado via signup)
 * NÃO faz login - apenas cria a conta
 */
export const createUser = async ({
  email,
  password,
}: CreateUserParams): Promise<UserOperationResult> => {
  try {
    // Criar usuário autenticado (signup no Supabase)
    if (!email || !password) {
      throw new Error('Email and password are required for authenticated user');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('User not created');

    // Salva usuário do Supabase localmente
    const newUser = {
      ...data.user,
      is_guest: false,
      synchronized_at: new Date().toISOString(),
    };

    localUser$.set(newUser);
    return { user: newUser };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      user: null,
      error: error instanceof Error || error instanceof AuthError ? error.message : 'Unknown error',
    };
  }
};

/**
 * Atualiza um usuário existente
 * Atualiza local sempre, e Supabase se não for guest
 */
export const updateUser = async (params: UpdateUserParams): Promise<UserOperationResult> => {
  try {
    const { id, ...updates } = params;

    // Pega usuário atual
    const currentUserData = localUser$.get();
    if (!currentUserData) throw new Error('No user to update');

    // Atualiza localmente
    const updatedUser = {
      ...currentUserData,
      ...updates,
    };

    localUser$.set(updatedUser);

    // Se não for guest, atualiza no Supabase também
    if (!updatedUser.is_guest && updates.email) {
      const { error } = await supabase.auth.updateUser({
        email: updates.email,
      });

      if (error) {
        console.error('Error updating user in Supabase:', error);
        // Não falha - mantém atualização local
      }
    }

    return { user: updatedUser };
  } catch (error) {
    console.error('Error updating user:', error);
    return { user: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Soft delete - marca usuário como deletado
 * Preenche deleted_at tanto local quanto Supabase
 */
export const softDeleteUser = async (id: string): Promise<UserOperationResult> => {
  try {
    const currentUser = localUser$.get();
    if (!currentUser || currentUser.id !== id) {
      throw new Error('User not found or ID mismatch');
    }

    const deletedAt = new Date().toISOString();

    // Atualiza localmente
    const updatedUser = {
      ...currentUser,
      deleted_at: deletedAt,
    };

    localUser$.set(updatedUser);

    // Se não for guest, marca como deletado no Supabase também
    // Type guard: verifica se tem propriedade is_guest
    const isGuest = 'is_guest' in currentUser && currentUser.is_guest;

    if (!isGuest) {
      const { error } = await supabase.auth.updateUser({
        data: { deleted_at: deletedAt },
      });

      if (error) {
        console.error('Error soft deleting user in Supabase:', error);
      }
    }

    return { user: updatedUser };
  } catch (error) {
    console.error('Error soft deleting user:', error);
    return { user: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Hard delete - remove usuário permanentemente
 */
export const hardDeleteUser = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const currentUser = localUser$.get();
    if (!currentUser || currentUser.id !== id) {
      throw new Error('User not found or ID mismatch');
    }

    // Type guard: verifica se tem propriedade is_guest
    const isGuest = 'is_guest' in currentUser && currentUser.is_guest;

    // Se não for guest, deleta do Supabase
    if (!isGuest) {
      // Nota: Supabase não permite delete de usuário via client SDK
      // Isso deve ser feito via Admin API ou Database Function
      console.warn('Hard delete for authenticated users must be done via Admin API');
    }

    // Remove localmente
    localUser$.set(null);

    return { success: true };
  } catch (error) {
    console.error('Error hard deleting user:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Realiza login no Supabase e sincroniza usuário local
 */
export const loginUser = async (email: string, password: string): Promise<UserOperationResult> => {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Faz login no Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log(error?.message);

    if (error) throw error;
    if (!data.user) throw new Error('Login failed');

    // Sincroniza com usuário local
    const syncedUser = await syncUserWithSupabase();

    return syncedUser;
  } catch (error) {
    console.error('Error logging in user:', error);
    return { user: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Sincroniza usuário local com dados do Supabase
 * NÃO faz login - apenas pega dados do usuário já autenticado
 */
export const syncUserWithSupabase = async (): Promise<UserOperationResult> => {
  try {
    // Pega dados do usuário autenticado do Supabase
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    if (!supabaseUser) {
      throw new Error('No authenticated user in Supabase');
    }

    // Atualiza usuário local com dados do Supabase
    const syncedUser = await updateUser({
      id: supabaseUser.id,
      email: supabaseUser.email,
      is_guest: false,
      synchronized_at: new Date().toISOString(),
    });

    // Se updateUser retornou null, usa dados do Supabase diretamente
    if (!syncedUser.user) {
      const userWithSync = {
        ...supabaseUser,
        is_guest: false,
        synchronized_at: new Date().toISOString(),
      };
      localUser$.set(userWithSync);
      return { user: userWithSync };
    }

    return syncedUser;
  } catch (error) {
    console.error('Error syncing user with Supabase:', error);
    return { user: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Cria um usuário guest
 * Função separada para criação explícita pela UI
 */
export const createGuestUser = async (name?: string): Promise<UserOperationResult> => {
  try {
    const id = generateId();
    if (!id) throw new Error('Failed to generate ID');

    const newUserGuest: UserGuestType = {
      id,
      name,
      is_guest: true,
      created_at: new Date().toISOString(),
    };

    localUser$.set(newUserGuest);
    return { user: newUserGuest };
  } catch (error) {
    console.error('Error creating guest user:', error);
    return { user: null };
  }
};

export const logOutUser = async () => {
  try {
    await supabase.auth.signOut();
    localUser$.set(null);

    return { success: true };
  } catch (error) {
    console.error('Error logging out user:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
