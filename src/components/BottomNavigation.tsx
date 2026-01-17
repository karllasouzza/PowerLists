import React, { useRef, useEffect, useState } from 'react';

import { useRouter } from 'expo-router';
import { View, Animated } from 'react-native';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Icon } from './ui/icon';
import { LucideIcon } from 'lucide-react-native';

interface BottomNavigationProps {
  currentSegment: string;
  screens: {
    name: string;
    label: string;
    icon: { default: LucideIcon; filled: LucideIcon };
  }[];
}

const BottomNavigation = ({ currentSegment, screens }: BottomNavigationProps) => {
  const router = useRouter();

  const animatedX = useRef(new Animated.Value(0)).current;
  const [buttonPositions, setButtonPositions] = useState<{ [key: string]: number }>({});
  const [activeIcon, setActiveIcon] = useState(currentSegment);

  const iconScales = useRef<{ [key: string]: Animated.Value }>(
    screens.reduce(
      (acc, screen) => {
        acc[screen.name] = new Animated.Value(screen.name === currentSegment ? 1 : 0.8);
        return acc;
      },
      {} as { [key: string]: Animated.Value }
    )
  ).current;

  useEffect(() => {
    if (buttonPositions[currentSegment] !== undefined) {
      // Shrink previous icon
      if (activeIcon !== currentSegment && iconScales[activeIcon]) {
        Animated.timing(iconScales[activeIcon], {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }).start();
      }

      // Change icon earlier (during the animation, not after)
      const iconChangeTimeout = setTimeout(() => {
        setActiveIcon(currentSegment);
        Animated.spring(iconScales[currentSegment], {
          toValue: 1,
          useNativeDriver: true,
          friction: 4,
          tension: 300,
        }).start();
      }, 150);

      Animated.spring(animatedX, {
        toValue: buttonPositions[currentSegment],
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }).start();

      return () => clearTimeout(iconChangeTimeout);
    }
  }, [currentSegment, buttonPositions, animatedX, activeIcon, iconScales]);

  const handleButtonLayout = (key: string, event: any) => {
    const { x } = event.nativeEvent.layout;
    setButtonPositions((prev) => ({ ...prev, [key]: x }));
  };

  return (
    <View className="absolute bottom-3 left-0 right-0 z-50 flex items-center justify-center">
      <View className="border-border/20 bg-bottom-bar relative box-border flex h-16 w-max max-w-[90%] flex-row items-center justify-between gap-4 truncate rounded-full border p-1 shadow-lg">
        <Animated.View
          style={{
            transform: [{ translateX: animatedX }],
          }}
          className="bg-bottom-bar-accent absolute h-14 w-14 rounded-full shadow-md"
        />
        {screens.map((screen) => {
          const isActive = screen.name === currentSegment;
          const showFilled = screen.name === activeIcon;
          return (
            <Button
              key={screen.name}
              onLayout={(event) => handleButtonLayout(screen.name, event)}
              variant="ghost"
              size="icon"
              onPress={() => !isActive && router.push(screen.name === 'index' ? '/' : screen.name)}
              className="relative z-10 flex h-14 w-14 flex-col gap-1 rounded-full hover:bg-transparent focus:bg-transparent active:bg-transparent">
              <Animated.View
                style={{
                  transform: [{ scale: iconScales[screen.name] }],
                }}>
                <Icon
                  as={showFilled ? screen.icon.filled : screen.icon.default}
                  className={cn(
                    'size-6',
                    showFilled
                      ? 'text-bottom-bar-accent fill-bottom-bar-foreground'
                      : 'text-bottom-bar-foreground'
                  )}
                />
              </Animated.View>
            </Button>
          );
        })}
      </View>
    </View>
  );
};

export default BottomNavigation;
