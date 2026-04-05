import { useOnboardingFirstAccess } from '@/features/onboarding/hooks/use-onboarding-first-access';
import OnboardingScreen from '@/features/onboarding/page';
import { Redirect } from 'expo-router';

export default function IndexScreen() {
  const { isFirstAccess, completeOnboarding } = useOnboardingFirstAccess();

  if (!isFirstAccess) {
    return <Redirect href="/auth" />;
  }

  return <OnboardingScreen onComplete={completeOnboarding} />;
}
