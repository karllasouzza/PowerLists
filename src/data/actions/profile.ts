import { supabase } from '@/lib/supabase';

const reauthenticate = async (currentPassword: string): Promise<{ error: string | null }> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return { error: 'Usuário não autenticado' };

  const { error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (error) return { error: 'Senha atual incorreta' };
  return { error: null };
};

export const updateEmail = async (
  currentPassword: string,
  email: string,
): Promise<{ error: string | null }> => {
  const { error: authError } = await reauthenticate(currentPassword);
  if (authError) return { error: authError };

  const { error } = await supabase.auth.updateUser({ email });
  if (error) return { error: error.message };
  return { error: null };
};

export const updatePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<{ error: string | null }> => {
  const { error: authError } = await reauthenticate(currentPassword);
  if (authError) return { error: authError };

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: error.message };
  return { error: null };
};
