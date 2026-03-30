import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Pressable } from 'react-native';
import ReanimatedAnimated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { cn } from '@/lib/utils';
import { Icon } from '../ui/icon';
import { Text } from '../ui/text';

interface NavItemProps {
  screen: {
    name: string;
    label: string;
    href: string;
    icon: { default: any; filled: any };
  };
  isActive: boolean;
  onPress: () => void;
}

const NavItem = ({ screen, isActive, onPress }: NavItemProps) => {
  const scale = useSharedValue(isActive ? 1.1 : 1);
  const opacity = useSharedValue(isActive ? 1 : 0.5);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (isActive) {
      scale.value = withSpring(1.1, { damping: 5, stiffness: 300 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withTiming(1, { duration: 200 });
      opacity.value = withTiming(0.5, { duration: 200 });
    }
  }, [isActive, scale, opacity]);

  const showFilled = isActive;

  return (
    <Pressable
      onPress={onPress}
      className="relative flex flex-row justify-center items-center gap-2 px-4 w-max h-full">
      <ReanimatedAnimated.View style={animatedStyle} className="flex justify-center items-center">
        <Icon
          as={showFilled ? screen.icon.filled : screen.icon.default}
          className={cn(
            'size-6',
            showFilled ? 'text-bottom-bar-accent' : 'text-bottom-bar-foreground',
          )}
        />
      </ReanimatedAnimated.View>

      {isActive && <Text className="text-bottom-bar-accent font-medium">{screen.label}</Text>}
    </Pressable>
  );
};

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

  return (
    <View className="right-0 bottom-4 left-0 z-50 absolute flex justify-center items-center px-4">
      <View className="relative flex flex-row items-center gap-4 bg-bottom-bar shadow-2xl border border-border rounded-3xl h-16">
        {screens.map((screen) => {
          const isActive = screen.name === currentSegment;

          const handlePress = () => {
            if (screen.name !== currentSegment) {
              router.navigate(screen.href as any);
            }
          };

          return (
            <NavItem key={screen.name} screen={screen} isActive={isActive} onPress={handlePress} />
          );
        })}
      </View>
    </View>
  );
};

export default BottomNavigation;
