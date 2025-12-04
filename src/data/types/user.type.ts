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

// Parâmetros para createUser unificado
export interface CreateUserParams {
  isGuest?: boolean;
  email?: string;
  password?: string;
  name?: string;
}

// Parâmetros para updateUser
export interface UpdateUserParams {
  id: string;
  email?: string;
  is_guest?: boolean;
  synchronized_at?: string;
  deleted_at?: string;
  // outros campos conforme necessário (exceto name - apenas em create)
}

// Resultado de operações de usuário
export interface UserOperationResult {
  user: UserType;
  error?: string;
}

// Legacy types (manter para compatibilidade temporária)
export type CreateUserGuestProps = { isGuest?: true; email?: string; password?: string };
export type CreateUserGuestResult = Promise<{ newUser: UserType } | undefined>;

export function isGuestUser(user: UserType): user is UserGuestType {
  return (user as UserGuestType)?.is_guest !== undefined;
}
