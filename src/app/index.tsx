import { Redirect } from 'expo-router';
import { OnboardingScreen, useOnboardingFirstAccess } from '@/features/onboarding';

export default function IndexScreen() {
  const { isFirstAccess, completeOnboarding } = useOnboardingFirstAccess();

  if (!isFirstAccess) {
    return <Redirect href="/auth" />;
  }

  return <OnboardingScreen onComplete={completeOnboarding} />;
}
