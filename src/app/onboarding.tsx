import { useRouter } from 'expo-router';
import { OnboardingContainer } from '@/components/onboarding';
import { useSlideContext } from '@/context/slides-context';

export default function OnboardingScreen() {
  const { completeOnboarding } = useSlideContext();
  const router = useRouter();

  const handleComplete = () => {
    completeOnboarding();
    router.replace('/');
  };

  return <OnboardingContainer completeOnboarding={handleComplete} />;
}
