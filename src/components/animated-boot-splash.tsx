import { Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import BootSplash from 'react-native-bootsplash';

type Props = {
  onAnimationEnd: () => void;
};

export const AnimatedBootSplash = ({ onAnimationEnd }: Props) => {
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  const { container, logo } = BootSplash.useHideAnimation({
    manifest: require('../../assets/bootsplash/manifest.json'),

    logo: require('../../assets/bootsplash/logo.png'),

    statusBarTranslucent: true,
    navigationBarTranslucent: true,

    animate: () => {
      const { height } = Dimensions.get('window');

      translateY.value = withSequence(withSpring(-50), withDelay(250, withSpring(height)));

      opacity.value = withDelay(
        350,
        withTiming(0, { duration: 150 }, (finished) => {
          'worklet';
          if (finished) runOnJS(onAnimationEnd)();
        }),
      );
    },
  });

  const containerStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const logoStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  return (
    <Animated.View
      {...container}
      style={[container.style, containerStyle]}
      className="bg-background!">
      <Animated.Image {...logo} style={[logo.style, logoStyle]} />
    </Animated.View>
  );
};
