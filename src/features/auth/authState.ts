import * as SecureStore from 'expo-secure-store';
import type { Session } from '@supabase/supabase-js';
import type { UserType } from '@/types/user';

const USER_KEY = 'powerlists_auth_user';

let currentUser: UserType = null;
let currentSession: Session | null = null;
const listeners = new Set<() => void>();

export function getCurrentUser(): UserType {
  return currentUser;
}

export function getCurrentSession(): Session | null {
  return currentSession;
}

export function getCurrentUserId(): string | null {
  return currentUser?.id ?? null;
}

export function setAuthState({
  user,
  session,
}: {
  user?: UserType;
  session?: Session | null;
}): void {
  if (user !== undefined) {
    currentUser = user;
    if (user) {
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)).catch(() => {});
    } else {
      SecureStore.deleteItemAsync(USER_KEY).catch(() => {});
    }
  }
  if (session !== undefined) {
    currentSession = session;
  }
  listeners.forEach((l) => l());
}

export async function loadPersistedUser(): Promise<UserType> {
  try {
    const stored = await SecureStore.getItemAsync(USER_KEY);
    if (stored) {
      currentUser = JSON.parse(stored);
    }
  } catch {
    currentUser = null;
  }
  return currentUser;
}

export function clearAuthState(): void {
  currentUser = null;
  currentSession = null;
  SecureStore.deleteItemAsync(USER_KEY).catch(() => {});
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
