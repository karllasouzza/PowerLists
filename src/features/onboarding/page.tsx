import OnboardingContainer from './components/onboarding-container';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  return <OnboardingContainer completeOnboarding={onComplete} />;
}
