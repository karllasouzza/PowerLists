import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AuthScreen from '@/features/auth/page';
import { useSlideContext } from '@/context/slides-context';

export default function IndexScreen() {
  const { isFirstAccess } = useSlideContext();
  const router = useRouter();

  useEffect(() => {
    if (isFirstAccess) {
      router.replace('/onboarding');
    }
  }, [isFirstAccess, router]);

  if (isFirstAccess) return null;

  return <AuthScreen />;
}
