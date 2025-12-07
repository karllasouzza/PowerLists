import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { IOnboardingCheckButtonProps } from './onboarding.types';
import { Text } from '../ui/text';

export const OnboardingCheckButton = ({
  index,
  current_slide,
  goToSlide,
  nextSlide,
  completeOnboarding,
  slide_pages,
  slide,
}: IOnboardingCheckButtonProps) => {
  const isChecked = index < current_slide;
  const handleCheck = () => {
    if (index < current_slide) {
      goToSlide(index);
    } else if (index === slide_pages.length - 1) {
      completeOnboarding();
    } else {
      nextSlide();
    }
  };

  const defaultClassName = `border-onboarding-${index + 1}-foreground`;
  const checkedClassName = `bg-onboarding-${index + 1} border-onboarding-${index + 1}`;
  const indicatorClassName = `bg-onboarding-${index + 1}`;
  const iconClassName = `text-onboarding-${index + 1}-foreground`;
  const textForeground = `text-onboarding-${index + 1}-foreground`;

  return (
    <Button variant="ghost" onPress={handleCheck}>
      <Checkbox
        checked={isChecked}
        className={defaultClassName}
        onCheckedChange={handleCheck}
        checkedClassName={checkedClassName}
        indicatorClassName={indicatorClassName}
        iconClassName={iconClassName}
      />
      <Text variant="default" className={cn(textForeground, isChecked && 'line-through')}>
        {slide.content.title}
      </Text>
    </Button>
  );
};
