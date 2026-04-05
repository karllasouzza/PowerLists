import { useTheme } from '@/context/themes';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

export const useAuthPageLogic = () => {
  const router = useRouter();
  const { setBackgroundColor } = useTheme();

  setBackgroundColor('default');

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
