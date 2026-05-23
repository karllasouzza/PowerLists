import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';

const FIRST_ACCESS_KEY = 'app.first_access';

export const useOnboardingFirstAccess = () => {
  const [isFirstAccess, setIsFirstAccess] = useState<boolean | null>(null);

  useEffect(() => {
    SecureStore.getItemAsync(FIRST_ACCESS_KEY).then((value) => {
      setIsFirstAccess(value !== 'true');
    });
  }, []);

  const completeOnboarding = useCallback(() => {
    SecureStore.setItemAsync(FIRST_ACCESS_KEY, 'true').then(() => {
      setIsFirstAccess(false);
    });
  }, []);

  return {
    isFirstAccess,
    completeOnboarding,
  };
};
