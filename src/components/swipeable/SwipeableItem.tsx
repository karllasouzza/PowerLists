import React, { useRef, useMemo, useImperativeHandle } from 'react';
import { View, useWindowDimensions } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { GestureDetector } from 'react-native-gesture-handler';

import { createPanGuard, getSwipeHitSlop } from '@/lib/swipe-gesture';
import { cn } from '@/lib/utils';
import { useSwipeableItem } from './useSwipeableItem';
import type { SwipeableItemRef, SwipeableItemProps } from './types';

export const SwipeableItem = React.forwardRef<SwipeableItemRef, SwipeableItemProps>(
  function SwipeableItem(props, forwardedRef) {
    const { onOpen, onClose, className, children, ...rest } = props;
    const internalRef = useRef<React.ElementRef<typeof ReanimatedSwipeable>>(null);
    const { width } = useWindowDimensions();

    const panGuard = useMemo(() => createPanGuard(), []);
    const swipeHitSlop = useMemo(() => getSwipeHitSlop(width), [width]);

    const { handlers } = useSwipeableItem({ ref: internalRef, onOpen, onClose });

    useImperativeHandle(forwardedRef, () => ({
      close: () => internalRef.current?.close(),
    }));

    return (
      <View className={cn('overflow-hidden', className)}>
        <GestureDetector gesture={panGuard}>
          <ReanimatedSwipeable ref={internalRef} hitSlop={swipeHitSlop} {...handlers} {...rest}>
            {children}
          </ReanimatedSwipeable>
        </GestureDetector>
      </View>
    );
  },
);
