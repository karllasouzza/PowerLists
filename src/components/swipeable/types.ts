import type { ComponentProps } from 'react';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

export type ReanimatedSwipeableInstance = React.ElementRef<typeof ReanimatedSwipeable>;

export type SwipeableItemRef = {
  close(): void;
};

export type UseSwipeableItemOptions = {
  ref: React.RefObject<ReanimatedSwipeableInstance | null>;
  onOpen?: (direction: 'left' | 'right') => void;
  onClose?: () => void;
};

export type UseSwipeableItemReturn = {
  handlers: Pick<
    ComponentProps<typeof ReanimatedSwipeable>,
    'onSwipeableWillOpen' | 'onSwipeableOpen' | 'onSwipeableWillClose' | 'onSwipeableClose'
  >;
};

type OmittedSwipeableProps =
  | 'hitSlop'
  | 'onSwipeableWillOpen'
  | 'onSwipeableOpen'
  | 'onSwipeableWillClose'
  | 'onSwipeableClose';

export type SwipeableItemProps = Omit<
  ComponentProps<typeof ReanimatedSwipeable>,
  OmittedSwipeableProps
> & {
  onOpen?: (direction: 'left' | 'right') => void;
  onClose?: () => void;
  className?: string;
  children?: React.ReactNode;
};
