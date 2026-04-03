import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { IconMicrophone } from '@tabler/icons-react-native';
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

  const handlePress = () => {
    if (active) {
      onStop();
    } else {
      onPress();
      startRecordingPlayer.play();
    }
  };

  useEffect(() => {
    ring.value = withRepeat(
      withTiming(1, { duration: 1600, easing: Easing.out(Easing.quad) }),
      -1,
      false,
    );
  }, [ring]);

  const ringStyle = useAnimatedStyle(() => {
    const scale = interpolate(ring.value, [0, 1], [1, 1.7]);
    const opacity = interpolate(ring.value, [0, 1], [0.4, 0]);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View className="w-52 relative items-center justify-center">
      <Animated.View
        className="absolute h-20 w-20 rounded-full border border-primary/60"
        style={ringStyle}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          active ? 'Parar reconhecimento de voz' : 'Iniciar reconhecimento de voz'
        }
        className={cn(
          'h-20 w-20 items-center justify-center rounded-full border border-primary/70 bg-primary',
          active && 'bg-success',
        )}
        onPress={handlePress}>
        <Icon as={IconMicrophone} className="text-primary-foreground" size={34} />
      </Pressable>
    </View>
  );
};
