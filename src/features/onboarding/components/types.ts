import type { ImageSourcePropType } from 'react-native';

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
