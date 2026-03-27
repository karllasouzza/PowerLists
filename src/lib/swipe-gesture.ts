import { Gesture } from 'react-native-gesture-handler';
import { Dimensions, Platform } from 'react-native';

export const SWIPE_ACTIVE_OFFSET_X: [number, number] = [-12, 12];
export const SWIPE_FAIL_OFFSET_Y: [number, number] = [-8, 8];
export const SWIPE_HIT_SLOP_LEFT_RATIO = 0.15;

export const createPanGuard = () =>
  Gesture.Pan().activeOffsetX(SWIPE_ACTIVE_OFFSET_X).failOffsetY(SWIPE_FAIL_OFFSET_Y);

export const getSwipeHitSlop = (width?: number) =>
  Platform.select({
    android: {
      left: -Math.round((width ?? Dimensions.get('window').width) * SWIPE_HIT_SLOP_LEFT_RATIO),
    },
    ios: undefined,
  });

export default { createPanGuard, getSwipeHitSlop };
