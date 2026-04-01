import { ImageSourcePropType } from 'react-native';

export interface ISlide {
  content: {
    img: ImageSourcePropType;
    title: string;
    subtitle: string;
  };
}

export interface SlideItemProps {
  item: ISlide;
}

export interface SlidesProps {
  completeOnboarding: () => void;
}
