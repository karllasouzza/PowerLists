import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Animated, Pressable } from 'react-native';

import { cn } from '@/lib/utils';
import { Icon } from '../ui/icon';
import { Text } from '../ui/text';

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
  const router = useRouter();
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
      <View className="relative flex h-16 w-full max-w-md flex-row items-center justify-around rounded-3xl bg-bottom-bar shadow-2xl border border-border">
        {screens.map((screen) => {
          const isActive = screen.name === activeIcon;
          const showFilled = screen.name === activeIcon;

          const handlePress = () => {
            if (screen.name !== currentSegment) {
              router.replace(screen.href as any);
            }
          };

          return (
            <Pressable
              key={screen.name}
              onPress={handlePress}
              className="relative flex h-full flex-row items-center justify-center gap-2 px-2">
              <Animated.View
                style={{
                  transform: [{ scale: iconScales[screen.name] }],
                  opacity: iconOpacities[screen.name],
                }}
                className="flex items-center justify-center">
                <Icon
                  as={showFilled ? screen.icon.filled : screen.icon.default}
                  className={cn(
                    'size-6',
                    showFilled ? 'text-bottom-bar-accent' : 'text-bottom-bar-foreground',
                  )}
                />
              </Animated.View>

              {/* Active label */}
              {isActive && (
                <Animated.View
                  style={{
                    opacity: iconOpacities[screen.name],
                  }}>
                  <Text className="font-medium text-bottom-bar-accent">{screen.label}</Text>
                </Animated.View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default BottomNavigation;
