import { useUserPreferences } from '@/context/themes/context';
import { useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';

export const useAuthPageLogic = () => {
  const router = useRouter();
  const { setBackgroundColor } = useUserPreferences();

  useEffect(() => {
    setBackgroundColor('default');
  }, [setBackgroundColor]);

  const handleCreateAccount = useCallback(() => {
    router.navigate('/create-account');
  }, [router]);

  const handleLogin = useCallback(() => {
    router.navigate('/login');
  }, [router]);

  const handleGuest = useCallback(() => {
    router.navigate('/guest');
  }, [router]);

  return {
    handleCreateAccount,
    handleLogin,
    handleGuest,
  };
};
