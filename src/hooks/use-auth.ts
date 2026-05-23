import * as Linking from 'expo-linking';
import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';

import { SyncService, showToast } from '@/services';
import { supabase } from '@/lib/supabase';
import { isGuestUser } from '@/types/user';
import {
  fetchOrRestoreUser,
  syncWithSupabase,
  patchUser,
  signInWithPassword as signInAction,
  handleError,
  createSupabaseUser,
  performSignOut,
} from '@/database/operations/auth';
import {
  getCurrentUser,
  getCurrentSession,
  setAuthState,
  subscribe,
  clearAuthState,
} from '@/features/auth/authState';

export function useAuth() {
  const user = useSyncExternalStore(subscribe, getCurrentUser);
  const [session, setSession] = useState(getCurrentSession());
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribe(() => setSession(getCurrentSession()));
    return unsubscribe;
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setAuthState({ session: newSession, user: newSession?.user ?? getCurrentUser() });
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchUserDataAsync = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const current = getCurrentUser();

      if (!current) {
        setIsInitialized(true);
        setIsLoading(false);
        return false;
      }

      if (isGuestUser(current)) {
        const result = await fetchOrRestoreUser();
        setAuthState({ user: result.user });
        setIsInitialized(true);
        setIsLoading(false);
        return true;
      }

      const { data: sessionData } = await supabase.auth.getSession();

      if (sessionData.session) {
        const synced = await syncWithSupabase();
        if (synced.user) {
          setAuthState({ user: synced.user, session: sessionData.session });
          setIsInitialized(true);
          setIsLoading(false);
          return true;
        }
      }

      const updated = await patchUser({ id: current.id, is_guest: true });
      setAuthState({ user: updated.user, session: null });
      setIsInitialized(true);
      setIsLoading(false);
      return true;
    } catch {
      clearAuthState();
      setIsInitialized(true);
      setIsLoading(false);
      return false;
    }
  }, []);

  const signInWithPassword = useCallback(
    async ({ email, password }: { email: string; password: string }): Promise<boolean> => {
      try {
        if (!email || !password) throw new Error('Email and password are required');

        setIsLoading(true);
        const previousUser = getCurrentUser();

        const result = await signInAction(email, password);
        if (result.error) throw new Error(result.error);
        if (!result.user) throw new Error('Login failed');

        const {
          data: { session: newSession },
        } = await supabase.auth.getSession();

        if (isGuestUser(previousUser)) {
          const syncService = new SyncService();
          await syncService.promptDataMigration({
            guestId: previousUser.id,
            userId: result.user.id,
          });
        }

        setAuthState({ user: result.user, session: newSession });
        setIsLoading(false);

        showToast({
          type: 'success',
          title: 'Sucesso!',
          subtitle: 'Login realizado com sucesso',
        });
        return true;
      } catch (error) {
        console.error('Error on signInWithPassword:', error);
        setIsLoading(false);
        showToast({
          type: 'error',
          title: 'Erro ao conectar-se!',
          subtitle: handleError('Email ou senha inválido!', error),
        });
        return false;
      }
    },
    [],
  );

  const signUpWithPassword = useCallback(
    async ({ email, password }: { email: string; password: string }): Promise<void> => {
      try {
        setIsLoading(true);
        const previousUser = getCurrentUser();

        const result = await createSupabaseUser({ email, password });
        if (!result.user) throw new Error(result.error || 'Signup failed');

        const { data: sessionData } = await supabase.auth.getSession();

        if (isGuestUser(previousUser)) {
          const syncService = new SyncService();
          await syncService.promptDataMigration({
            guestId: previousUser.id,
            userId: result.user.id,
          });
        }

        setAuthState({ user: result.user, session: sessionData.session });
        setIsLoading(false);

        showToast({
          type: 'success',
          title: 'Sucesso!',
          subtitle: 'Conta criada com sucesso!',
        });
      } catch (error) {
        setIsLoading(false);
        showToast({
          type: 'error',
          title: 'Erro ao criar conta!',
          subtitle: handleError('Tente novamente mais tarde!', error),
        });
        throw error;
      }
    },
    [],
  );

  const signOut = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      await performSignOut();
      showToast({ type: 'success', title: 'Sucesso!', subtitle: 'Sessão encerrada!' });
      return true;
    } catch (error) {
      console.error('Error on signOut:', error);
      showToast({
        type: 'error',
        title: 'Erro ao desconectar!',
        subtitle: 'Tente novamente mais tarde!',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendResetPasswordByEmail = useCallback(
    async ({ email }: { email: string }): Promise<boolean> => {
      try {
        const redirectUrl = Linking.createURL('password-recovery');
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: redirectUrl,
        });
        if (error) throw error;

        showToast({
          type: 'success',
          title: 'Sucesso!',
          subtitle: 'Email de recuperação enviado!',
        });
        return true;
      } catch (error) {
        console.error('Error sending reset password email:', error);
        showToast({
          type: 'error',
          title: 'Erro ao enviar email!',
          subtitle: 'Tente novamente mais tarde!',
        });
        return false;
      }
    },
    [],
  );

  const resetPassword = useCallback(
    async ({ password }: { password: string }): Promise<boolean> => {
      try {
        setIsLoading(true);
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;

        showToast({ type: 'success', title: 'Sucesso!', subtitle: 'Senha atualizada!' });
        return true;
      } catch (error) {
        console.error(error);
        showToast({
          type: 'error',
          title: 'Erro ao atualizar senha!',
          subtitle: 'Tente novamente mais tarde!',
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const checkSession = useCallback(async (): Promise<void> => {
    try {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        const {
          data: { user: supaUser },
        } = await supabase.auth.getUser();

        if (supaUser) {
          const synced = await syncWithSupabase(supaUser);
          if (synced.user) {
            setAuthState({ user: synced.user, session: data.session });
          }
        }
      } else {
        const current = getCurrentUser();
        if (current) {
          const updated = await patchUser({ id: current.id, is_guest: true });
          setAuthState({ user: updated.user, session: null });
        }
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  }, []);

  return {
    session,
    isInitialized,
    isLoading,
    user,
    fetchUserDataAsync,
    signInWithPassword,
    signUpWithPassword,
    signOut,
    sendResetPasswordByEmail,
    resetPassword,
    checkSession,
  };
}
