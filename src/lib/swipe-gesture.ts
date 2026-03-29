import { Gesture } from 'react-native-gesture-handler';
import { Dimensions, Platform } from 'react-native';

export const SWIPE_ACTIVE_OFFSET_X: [number, number] = [-10, 10];
export const SWIPE_FAIL_OFFSET_Y: [number, number] = [-10, 10];
export const SWIPE_HIT_SLOP_LEFT_RATIO_ANDROID = 0.18;
export const SWIPE_HIT_SLOP_LEFT_RATIO_IOS = 0.12;
export const SWIPE_MIN_DISTANCE = 5;

export const createPanGuard = () =>
  Gesture.Pan()
    .minDistance(SWIPE_MIN_DISTANCE)
    .activeOffsetX(SWIPE_ACTIVE_OFFSET_X)
    .failOffsetY(SWIPE_FAIL_OFFSET_Y);

export const getSwipeHitSlop = (width?: number) =>
  Platform.select({
    android: {
      left: -Math.round(
        (width ?? Dimensions.get('window').width) * SWIPE_HIT_SLOP_LEFT_RATIO_ANDROID,
      ),
    },
    ios: {
      left: -Math.round((width ?? Dimensions.get('window').width) * SWIPE_HIT_SLOP_LEFT_RATIO_IOS),
    },
  });

export default { createPanGuard, getSwipeHitSlop };
