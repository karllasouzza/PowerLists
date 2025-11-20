import { AuthUser, Session } from '@supabase/supabase-js';

export type GetUserAuthResult = {
  user: AuthUser | null;
};

export type MakeSingUpWithEmailAndPasswordProps = {
  email: string;
  password: string;
  name: string;
};

export type MakeSignInWithEmailAndPasswordProps = {
  email: string;
  password: string;
};

export type MakeSendPasswordRecoveryEmailProps = {
  email: string;
};

export type MakeSignInWithEmailAndPasswordResult = {
  user: AuthUser | null;
  session: Session | null;
};
