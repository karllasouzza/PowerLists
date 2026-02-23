import React, { useRef, useEffect, useState } from 'react';
import { TabTrigger } from 'expo-router/ui';
import { View, Animated, Pressable, Text } from 'react-native';
import { cn } from '@/lib/utils';
import { Icon } from '../ui/icon';

interface BottomNavigationProps {
  currentSegment: string;
  screens: {
    name: string;
    label: string;
    href: string;
    icon: { default: any; filled: any };
  }[];
}

const BottomNavigation = ({ currentSegment, screens }: BottomNavigationProps) => {
  const [activeIcon, setActiveIcon] = useState(currentSegment);

  // Animation values for each icon
  const iconScales = useRef<{ [key: string]: Animated.Value }>(
    screens.reduce(
      (acc, screen) => {
        acc[screen.name] = new Animated.Value(screen.name === currentSegment ? 1.1 : 1);
        return acc;
      },
      {} as { [key: string]: Animated.Value },
    ),
  ).current;

  // Animation values for icon opacity
  const iconOpacities = useRef<{ [key: string]: Animated.Value }>(
    screens.reduce(
      (acc, screen) => {
        acc[screen.name] = new Animated.Value(screen.name === currentSegment ? 1 : 0.5);
        return acc;
      },
      {} as { [key: string]: Animated.Value },
    ),
  ).current;

  useEffect(() => {
    // Animate icon transitions
    if (activeIcon !== currentSegment) {
      // Shrink and fade previous icon
      if (iconScales[activeIcon] && iconOpacities[activeIcon]) {
        Animated.parallel([
          Animated.timing(iconScales[activeIcon], {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(iconOpacities[activeIcon], {
            toValue: 0.5,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }

      // Grow and brighten new icon
      setTimeout(() => {
        setActiveIcon(currentSegment);
        Animated.parallel([
          Animated.spring(iconScales[currentSegment], {
            toValue: 1.1,
            useNativeDriver: true,
            friction: 5,
            tension: 300,
          }),
          Animated.timing(iconOpacities[currentSegment], {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }, 100);
    }
  }, [currentSegment, activeIcon, iconScales, iconOpacities]);

  return (
    <View className="absolute bottom-4 left-0 right-0 z-50 flex items-center justify-center px-4">
      <View className="relative flex h-16 w-full max-w-md flex-row items-center justify-around rounded-3xl bg-black/90 shadow-2xl">
        {screens.map((screen) => {
          const isActive = screen.name === activeIcon;
          const showFilled = screen.name === activeIcon;

          return (
            <TabTrigger key={screen.name} name={screen.name} asChild>
              <Pressable className="relative flex h-full flex-row items-center justify-center gap-2 px-2">
                <Animated.View
                  style={{
                    transform: [{ scale: iconScales[screen.name] }],
                    opacity: iconOpacities[screen.name],
                  }}
                  className="flex items-center justify-center">
                  <Icon
                    as={showFilled ? screen.icon.filled : screen.icon.default}
                    className={cn('size-6', showFilled ? 'text-primary' : 'text-white/70')}
                  />
                </Animated.View>

                {/* Active label */}
                {isActive && (
                  <Animated.View
                    style={{
                      opacity: iconOpacities[screen.name],
                    }}>
                    <Text className="text-xs font-medium text-primary">{screen.label}</Text>
                  </Animated.View>
                )}
              </Pressable>
            </TabTrigger>
          );
        })}
      </View>
    </View>
  );
};

export default BottomNavigation;
