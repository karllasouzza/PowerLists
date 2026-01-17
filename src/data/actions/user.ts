import { observable } from '@legendapp/state';
import { supabase } from '@/lib/supabase';
import { generateId } from '../utils';
import type {
  UserType,
  UserGuestType,
  CreateUserParams,
  UpdateUserParams,
  UserOperationResult,
} from '../types/user';
import { AuthError, AuthUser } from '@supabase/supabase-js';

export const localUser$ = observable<UserType>(null);

localUser$.get();

export const getUser = async (): Promise<UserOperationResult> => {
  try {
    const localUserData = localUser$.get();
    if (localUserData) {
      return { user: localUserData };
    }

    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    if (supabaseUser) {
      localUser$.set(supabaseUser);
      return { user: supabaseUser };
    }

    return { user: null };
  } catch (error) {
    console.error('Error getting user:', error);
    return { user: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const createUser = async ({
  email,
  password,
}: CreateUserParams): Promise<UserOperationResult> => {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required for authenticated user');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('User not created');

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

export const updateUser = async ({
  id,
  ...updates
}: UpdateUserParams): Promise<UserOperationResult> => {
  try {
    if (!id) throw new Error('User ID is required');
    if (!updates) throw new Error('Updates are required');

    const currentUserData = localUser$.get();
    if (!currentUserData) {
      return { user: null };
    }

    const updatedUser = {
      ...currentUserData,
      ...updates,
    };

    localUser$.set(updatedUser);

    if (!updatedUser.is_guest && updates.email) {
      const { error } = await supabase.auth.updateUser({
        email: updates.email,
      });

      if (error) {
        console.error('Error updating user in Supabase:', error);
      }
    }

    return { user: updatedUser };
  } catch (error) {
    console.error('Error updating user:', error);
    return { user: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const softDeleteUser = async (id: string): Promise<UserOperationResult> => {
  try {
    if (!id) throw new Error('User ID is required');

    const currentUser = localUser$.get();
    if (!currentUser || currentUser.id !== id) {
      throw new Error('User not found or ID mismatch');
    }

    const deletedAt = new Date().toISOString();

    const updatedUser = {
      ...currentUser,
      deleted_at: deletedAt,
    };

    localUser$.set(updatedUser);

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

export const hardDeleteUser = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!id) throw new Error('User ID is required');

    const currentUser = localUser$.get();
    if (!currentUser || currentUser.id !== id) {
      throw new Error('User not found or ID mismatch');
    }
    const isGuest = 'is_guest' in currentUser && currentUser.is_guest;

    if (!isGuest) {
      const { error } = await supabase.functions.invoke('user-self-deletion');

      if (error) {
        console.error('Error hard deleting user in Supabase:', error);
      }
    }

    localUser$.set(null);

    return { success: true };
  } catch (error) {
    console.error('Error hard deleting user:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const loginUser = async (email: string, password: string): Promise<UserOperationResult> => {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (!data.user) throw new Error('Login failed');

    const syncedUser = await syncUserWithSupabase({ user: data.user });

    return syncedUser;
  } catch (error) {
    console.error('Error logging in user:', error);
    return { user: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const syncUserWithSupabase = async ({
  user,
}: {
  user?: AuthUser;
}): Promise<UserOperationResult> => {
  try {
    let supabaseUser = user;

    if (!user) {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        throw new Error('No authenticated user in Supabase');
      }

      supabaseUser = data.user;
    }

    if (!supabaseUser) {
      throw new Error('No authenticated user in Supabase');
    }

    const syncedUser = await updateUser({
      id: supabaseUser.id,
      email: supabaseUser.email,
      is_guest: false,
      synchronized_at: new Date().toISOString(),
    });

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
