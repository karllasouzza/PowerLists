import { supabase } from '@/lib/supabase';
import {
  GetUserAuthResult,
  MakeSendPasswordRecoveryEmailProps,
  MakeSignInWithEmailAndPasswordProps,
  MakeSignInWithEmailAndPasswordResult,
  MakeSingUpWithEmailAndPasswordProps,
} from '../../types';

export const getUserAuth = async (): Promise<GetUserAuthResult> => {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) throw error;
    if (!data) throw new Error('Data not found');
    if (!data.user) throw Error('User not found');

    return { user: data.user };
  } catch (error) {
    console.log(error);
    return { user: null };
  }
};

export const makeSingUpWithEmailAndPassword = async ({
  email,
  password,
  name,
}: MakeSingUpWithEmailAndPasswordProps) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) throw error;
    if (!data.session) throw new Error('Data not found');
    if (!data.user && data.user !== null) throw Error('User not found');

    return { user: data.user, session: data.session };
  } catch (error) {
    console.log(error);
    return { user: null, session: null };
  }
};

export const makeSignInWithEmailAndPassword = async ({
  email,
  password,
}: MakeSignInWithEmailAndPasswordProps): Promise<MakeSignInWithEmailAndPasswordResult> => {
  try {
    const {
      data: { session, user },
      error,
    } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) throw error;
    if (!session) throw new Error('Session not found');
    if (!user && user !== null) throw Error('User not found');

    return { user, session };
  } catch (error) {
    console.log(error);
    return { user: null, session: null };
  }
};

export const makeSingOut = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const sendPasswordRecoveryEmail = async ({
  email,
}: MakeSendPasswordRecoveryEmailProps): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'powerlists.project://PasswordRecovery',
    });
    if (error) throw error;

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
