import { useValue } from '@legendapp/state/react';
import { completeFirstAccess } from '@/data/actions/first-access';
import { firstAccess$ } from '@/data/states/first-access';

export const useOnboardingFirstAccess = () => {
  const hasCompletedOnboarding = useValue(firstAccess$.hasCompletedOnboarding);

  const completeOnboarding = () => {
    completeFirstAccess();
  };

  return {
    isFirstAccess: !hasCompletedOnboarding,
    completeOnboarding,
  };
};
