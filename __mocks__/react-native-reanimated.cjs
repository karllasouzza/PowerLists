'use strict';

/**
 * Minimal manual mock for react-native-reanimated.
 *
 * Replicates the behavior of the official mock (react-native-reanimated/mock)
 * without importing react-native, avoiding ESM parse errors in Jest node environment.
 *
 * Key behaviors:
 * - useSharedValue(init) → returns a { value: init } proxy (read/write .value)
 * - withTiming(toValue, config?, callback?) → returns toValue immediately, calls callback(true)
 * - withDelay(delayMs, nextAnimation) → returns nextAnimation (already resolved)
 * - withSpring(toValue, config?, callback?) → returns toValue immediately, calls callback(true)
 */

const useSharedValue = (init) => {
  const state = { value: init };
  return new Proxy(state, {
    get(target, prop) {
      if (prop === 'value') return target.value;
      return undefined;
    },
    set(target, prop, newValue) {
      if (prop === 'value') {
        target.value = newValue;
        return true;
      }
      return false;
    },
  });
};

const withTiming = (toValue, _config, callback) => {
  if (typeof callback === 'function') callback(true);
  return toValue;
};

const withDelay = (_delayMs, nextAnimation) => {
  return nextAnimation;
};

const withSpring = (toValue, _config, callback) => {
  if (typeof callback === 'function') callback(true);
  return toValue;
};

const withSequence = (...animations) => {
  return animations[animations.length - 1] ?? 0;
};

const useAnimatedStyle = (fn) => fn();

const useAnimatedProps = (fn) => fn();

const runOnJS = (fn) => fn;

const cancelAnimation = () => {};

module.exports = {
  __esModule: true,
  useSharedValue,
  withTiming,
  withDelay,
  withSpring,
  withSequence,
  useAnimatedStyle,
  useAnimatedProps,
  runOnJS,
  cancelAnimation,
  default: {},
};
