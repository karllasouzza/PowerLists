import { ImageSourcePropType } from 'react-native';

export interface ISlide {
  content: {
    img: ImageSourcePropType;
    title: string;
    subtitle: string;
  };
}

export interface SlideItemProps {
  index: number;
  item: ISlide;
}

export interface SlidesProps {
  current_slide: number;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (slide: number) => void;
  completeOnboarding: () => void;
}

export interface IOnboardingCheckButtonProps {
  index: number;
  current_slide: number;
  goToSlide: (slide: number) => void;
  nextSlide: () => void;
  completeOnboarding: () => void;
  slide_pages: ISlide[];
  slide: ISlide;
}
