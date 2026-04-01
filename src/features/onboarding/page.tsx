import { OnboardingContainer } from './components';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  return <OnboardingContainer completeOnboarding={onComplete} />;
}
