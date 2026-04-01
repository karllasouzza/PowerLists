import React from 'react';
import { Pressable, PressableProps, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { cn } from '@/lib/utils';
import { Icon } from './icon';
import type { Icon as TablerIcon } from '@tabler/icons-react-native';

export interface FabProps extends PressableProps {
  icon: TablerIcon;
  label?: string;
  className?: string;
  buttonClassName?: string;
  iconClassName?: string;
  labelClassName?: string;
}

const Fab = React.forwardRef<View, FabProps>(
  (
    {
      icon,
      label,
      className,
      buttonClassName,
      iconClassName,
      labelClassName,
      onPressIn,
      onPressOut,
      onPress,
      ...props
    },
    ref,
  ) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }));

    const handlePressIn = (e: any) => {
      // Abre imediatamente, sem esperar animação
      if (onPress) runOnJS(onPress)(e);

      scale.value = withSpring(0.93, { damping: 20, stiffness: 400, mass: 0.5 });
      opacity.value = withTiming(0.8, { duration: 60 });

      if (onPressIn) onPressIn(e);
    };

    const handlePressOut = (e: any) => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300, mass: 0.5 });
      opacity.value = withTiming(1, { duration: 80 });

      if (onPressOut) onPressOut(e);
    };

    return (
      <View
        ref={ref}
        className={cn('right-4 bottom-24 z-50 absolute', className)}
        pointerEvents="box-none">
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className="shadow-2xl"
          {...props}>
          <Animated.View
            style={animatedStyle}
            className={cn(
              'flex flex-row justify-center items-center bg-primary p-4 border border-border rounded-3xl',
              buttonClassName,
            )}>
            <Icon as={icon} className={cn('size-6 text-primary-foreground', iconClassName)} />
            {label && (
              <Text
                className={cn('ml-2 font-medium text-primary-foreground text-sm', labelClassName)}>
                {label}
              </Text>
            )}
          </Animated.View>
        </Pressable>
      </View>
    );
  },
);

Fab.displayName = 'Fab';

export { Fab };
