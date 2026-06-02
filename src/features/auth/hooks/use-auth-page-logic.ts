import { useUserPreferences } from '@/context/themes/context';
import { useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';

import { useUser } from '@/hooks/use-user';
import { isGuestUser } from '@/types/user';

export const useAuthPageLogic = () => {
  const router = useRouter();
  const { setBackgroundColor } = useUserPreferences();
  const { user, createGuest } = useUser();

  useEffect(() => {
    setBackgroundColor('default');
  }, [setBackgroundColor]);

  const handleCreateAccount = useCallback(() => {
    router.navigate('/create-account');
  }, [router]);

  const handleLogin = useCallback(() => {
    router.navigate('/login');
  }, [router]);

  const handleGuest = useCallback(async () => {
    await createGuest({});
    router.replace('/(authenticated)');
  }, [createGuest, router]);

  return {
    handleCreateAccount,
    handleLogin,
    handleGuest,
    isAlreadyGuest: isGuestUser(user),
  };
};
