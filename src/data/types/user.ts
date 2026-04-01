import type { User as SupabaseUser } from '@supabase/supabase-js';

export type UserType = SupabaseUser | UserGuestType | null;

export interface UserGuestType {
  id: string;
  name?: string;
  email?: string;
  is_guest: boolean;
  created_at: string;
  synchronized_at?: string;
  deleted_at?: string;
}

export interface CreateUserParams {
  email: string;
  password: string;
  fullName: string;
}

export interface UpdateUserParams {
  id: string;
  email?: string;
  is_guest?: boolean;
  synchronized_at?: string;
  deleted_at?: string;
}

export interface UserOperationResult {
  user: UserType;
  error?: string;
}

export type CreateUserGuestProps = { isGuest?: true; email?: string; password?: string };
export type CreateUserGuestResult = Promise<{ newUser: UserType } | undefined>;

export function isGuestUser(user: UserType): user is UserGuestType {
  return (user as UserGuestType)?.is_guest === true;
}
