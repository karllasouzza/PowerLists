import { ImageSourcePropType } from 'react-native';

export interface SlideItemProps {
  item: {
    className?: string;
    content: {
      img: ImageSourcePropType;
      title: string;
      subtitle: string;
    };
  };
}

export interface SlidesProps {
  current_slide: number;
  nextSlide: () => void;
  prevSlide: () => void;
  completeOnboarding: () => void;
}
