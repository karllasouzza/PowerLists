import { UserType } from '@/data/types/user';
import type { Session } from '@supabase/supabase-js';

export interface AuthState {
  user: UserType;
  session: Session | null;
  isInitialized: boolean;
  isLoading: boolean;
}

export interface AuthActions {
  initialize: () => Promise<void>;
  signIn: ({ email, password }: { email: string; password: string }) => Promise<boolean>;
  signUp: ({ email, password }: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<boolean>;
  sendResetPasswordByEmail: ({ email }: { email: string }) => Promise<boolean>;
  resetPassword: ({ password }: { password: string }) => Promise<boolean>;
  checkSession: () => Promise<void>;
  updateUser: ({ updates }: { updates: Partial<UserType> }) => Promise<void>;
  createGuest: ({ name }: { name?: string }) => Promise<UserType>;
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
