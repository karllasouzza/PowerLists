import { AuthError, AuthUser } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';
import type {
  UserGuestType,
  CreateUserParams,
  UpdateUserParams,
  UserOperationResult,
} from '@/data/types/user';
import { generateId } from '@/data/utils';
import { resetProfilesStore } from '@/data/states/profile';
import { resetListStore } from '@/data/states/lists';
import { resetListItemsStore } from '@/data/states/list-items';
import { auth$ } from '@/data/states/auth';

export async function fetchOrRestoreUser(): Promise<UserOperationResult> {
  const useCached = auth$.user.get();
  if (useCached) return { user: useCached };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    auth$.user.set(user);
    return { user };
  }

  return { user: null };
}

export async function createSupabaseUser({
  email,
  password,
}: CreateUserParams): Promise<UserOperationResult> {
  if (!email || !password) throw new Error('Email and password are required');

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error('User not created');

  const newUser = {
    ...data.user,
    is_guest: false,
    synchronized_at: new Date().toISOString(),
  };

  auth$.user.set(newUser);
  return { user: newUser };
}

export async function patchUser({
  id,
  ...updates
}: UpdateUserParams): Promise<UserOperationResult> {
  if (!id) throw new Error('User ID is required');

  const current = auth$.user.get();
  if (!current) return { user: null };

  const patched = { ...current, ...updates };
  auth$.user.set(patched);

  if (!patched.is_guest && updates.email) {
    const { error } = await supabase.auth.updateUser({ email: updates.email });
    if (error) console.error('Error updating user in Supabase:', error);
  }

  return { user: patched };
}

export async function syncWithSupabase(user?: AuthUser): Promise<UserOperationResult> {
  let supabaseUser = user;

  if (!supabaseUser) {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw new Error('No authenticated user in Supabase');
    supabaseUser = data.user;
  }

  const synced = await patchUser({
    id: supabaseUser.id,
    email: supabaseUser.email,
    is_guest: false,
    synchronized_at: new Date().toISOString(),
  });

  if (synced.user) return synced;

  const fallback = {
    ...supabaseUser,
    is_guest: false,
    synchronized_at: new Date().toISOString(),
  };
  auth$.user.set(fallback);
  return { user: fallback };
}

export async function signInWithPassword(
  email: string,
  password: string,
): Promise<UserOperationResult> {
  if (!email || !password) throw new Error('Email and password are required');

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error('Login failed');

  return syncWithSupabase(data.user);
}

export async function createGuest(name?: string): Promise<UserOperationResult> {
  const id = generateId();
  if (!id) throw new Error('Failed to generate ID');

  const guest: UserGuestType = {
    id,
    name,
    is_guest: true,
    created_at: new Date().toISOString(),
  };

  auth$.user.set(guest);
  return { user: guest };
}

export async function performSignOut() {
  await supabase.auth.signOut();
  auth$.user.set(null);
  resetProfilesStore();
  resetListStore();
  resetListItemsStore();
}

export function handleError(msg: string, error: unknown): string {
  return error instanceof Error || error instanceof AuthError ? error.message : msg;
}
