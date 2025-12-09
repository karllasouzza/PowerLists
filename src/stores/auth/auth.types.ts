import { UserType } from '@/data/types/user.type';
import type { Session } from '@supabase/supabase-js';

export interface AuthState {
  user: UserType;
  session: Session | null;
  isInitialized: boolean;
  isLoading: boolean;
}

export interface AuthActions {
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  checkSession: () => Promise<void>;
  updateUser: (updates: Partial<UserType>) => Promise<void>;
  createGuest: (name?: string) => Promise<UserType>;
}

export type AuthStore = AuthState & AuthActions;

export interface MigrationData {
  guestId: string;
  userId: string;
  listsCount: number;
}

export interface MigrationResult {
  success: boolean;
  itemsMigrated: number;
  error?: string;
}
