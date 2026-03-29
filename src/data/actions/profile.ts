import { supabase } from '@/lib/supabase';

export const updateEmail = async (email: string): Promise<{ error: string | null }> => {
  const { error } = await supabase.auth.updateUser({ email });
  if (error) return { error: error.message };
  return { error: null };
};

export const updatePassword = async (newPassword: string): Promise<{ error: string | null }> => {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: error.message };
  return { error: null };
};
