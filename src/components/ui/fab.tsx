import React, { useRef } from 'react';
import { Animated, Pressable, PressableProps, Text, View } from 'react-native';
import { cn } from '@/lib/utils';
import { Icon } from './icon';
import { LucideIcon } from 'lucide-react-native';

export interface FabProps extends PressableProps {
  icon: LucideIcon;
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
      ...props
    },
    ref,
  ) => {
    const scale = useRef(new Animated.Value(1)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    const handlePressIn = (e: any) => {
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      if (onPressIn) onPressIn(e);
    };

    const handlePressOut = (e: any) => {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 5,
          tension: 300,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      if (onPressOut) onPressOut(e);
    };

    return (
      <View
        ref={ref}
        className={cn('absolute bottom-24 right-4 z-50', className)}
        pointerEvents="box-none">
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className="shadow-2xl"
          {...props}>
          <Animated.View
            style={{
              transform: [{ scale }],
              opacity,
            }}
            className={cn(
              'flex flex-row items-center justify-center rounded-3xl bg-primary border border-border p-4',
              buttonClassName,
            )}>
            <Icon as={icon} className={cn('size-6 text-primary-foreground', iconClassName)} />
            {label && (
              <Text
                className={cn('ml-2 text-sm font-medium text-primary-foreground', labelClassName)}>
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
