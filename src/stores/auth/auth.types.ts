import type { Session } from '@supabase/supabase-js';

/**
 * Representa um usuário no sistema (guest ou authenticated)
 */
export interface User {
  /** UUID gerado localmente (guest) ou ID do Supabase (authenticated) */
  id: string;

  /** Email do usuário (apenas se authenticated) */
  email?: string;

  /** Nome do usuário */
  name?: string;

  /** URL do avatar */
  avatarUrl?: string;

  /** Flag indicando se é usuário guest */
  isGuest: boolean;

  /** Data de criação do usuário */
  createdAt: string;
}

/**
 * Estado da autenticação
 */
export interface AuthState {
  /** Usuário atual (guest ou authenticated) */
  user: User | null;

  /** Sessão do Supabase (apenas se authenticated) */
  session: Session | null;

  /** Flag indicando se o store foi inicializado */
  isInitialized: boolean;

  /** Flag indicando operação em andamento */
  isLoading: boolean;
}

/**
 * Ações disponíveis no store de autenticação
 */
export interface AuthActions {
  /** Inicializa o store (carrega usuário ou cria guest) */
  initialize: () => Promise<void>;

  /** Faz login com email e senha */
  signIn: (email: string, password: string) => Promise<void>;

  /** Cria nova conta */
  signUp: (name: string, email: string, password: string) => Promise<void>;

  /** Faz logout (mantém dados locais) */
  signOut: () => Promise<void>;

  /** Envia email de recuperação de senha */
  resetPassword: (email: string) => Promise<void>;

  /** Verifica se existe sessão válida no Supabase */
  checkSession: () => Promise<void>;

  /** Atualiza dados do usuário */
  updateUser: (updates: Partial<User>) => void;
}

/**
 * Store completo de autenticação
 */
export type AuthStore = AuthState & AuthActions;

/**
 * Dados para migração de guest para usuário authenticated
 */
export interface MigrationData {
  /** ID do usuário guest */
  guestId: string;

  /** ID do usuário authenticated */
  userId: string;

  /** Número de listas a serem migradas */
  listsCount: number;
}

/**
 * Resultado da migração
 */
export interface MigrationResult {
  /** Se a migração foi bem-sucedida */
  success: boolean;

  /** Número de itens migrados */
  itemsMigrated: number;

  /** Mensagem de erro (se houver) */
  error?: string;
}
