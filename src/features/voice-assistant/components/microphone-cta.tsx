import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { IconMicrophone, IconMicrophoneFilled } from '@tabler/icons-react-native';
import { Pressable, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import useAssistantAudios from '../hooks/use-assistant-audios';

interface MicrophoneCtaProps {
  active: boolean;
  isAuto?: boolean;
  onPress: () => void;
  onStop: () => void;
}

export const MicrophoneCta = ({ active, onPress, isAuto, onStop }: MicrophoneCtaProps) => {
  const ring = useSharedValue(0);
  const { startRecordingPlayer } = useAssistantAudios();

  const handlePress = async () => {
    if (active) {
      await onStop();
    } else {
      await onPress();
    }

    await startRecordingPlayer.play();
  };

  useEffect(() => {
    if (active || isAuto) {
      ring.value = withRepeat(
        withTiming(1, { duration: 1600, easing: Easing.out(Easing.quad) }),
        -1,
        true,
      );
    } else {
      ring.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.quad) });
    }
  }, [active, isAuto, ring]);

  const ringStyle = useAnimatedStyle(() => {
    const scale = interpolate(ring.value, [0, 1], [1, 1.7]);
    const opacity = interpolate(ring.value, [0, 1], [0.7, 0]);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    const scale = interpolate(ring.value, [0, 1], [1, 1.12]);
    return {
      transform: [{ scale }],
    };
  });

  return (
    <View className="size-36 relative items-center justify-center">
      <Animated.View
        className={cn(
          'absolute h-20 w-20 rounded-full',
          (active || isAuto) && 'border border-primary-foreground',
        )}
        style={ringStyle}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          active || isAuto ? 'Parar reconhecimento de voz' : 'Iniciar reconhecimento de voz'
        }
        className={cn(
          'h-20 w-20 items-center justify-center border rounded-full',
          active || isAuto ? 'border-primary-foreground' : 'border-muted',
        )}
        onPress={handlePress}>
        <Animated.View style={iconStyle}>
          <Icon
            as={active || isAuto ? IconMicrophoneFilled : IconMicrophone}
            size={34}
            className="text-primary-foreground"
          />
        </Animated.View>
      </Pressable>
    </View>
  );
};
