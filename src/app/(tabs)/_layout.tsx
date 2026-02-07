'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';

import '@/css/global.css';
import { View } from 'react-native';
import BottomNavigation from '@/components/BottomNavigation';
import { StackAnimationTypes } from 'react-native-screens';
import {
  IconHome,
  IconHomeFilled,
  IconUser,
  IconUserFilled,
  IconSettings,
  IconSettingsFilled,
} from '@tabler/icons-react-native';

const SCREENS = [
  {
    name: 'index',
    label: 'Inicio',
    icon: { default: IconHome, filled: IconHomeFilled },
    options: {},
  },
  {
    name: 'account',
    label: 'Conta',
    icon: { default: IconUser, filled: IconUserFilled },
    options: {},
  },
  {
    name: 'settings',
    label: 'Configurações',
    icon: { default: IconSettings, filled: IconSettingsFilled },
    options: {},
  },
];

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);

      // const [isProfilePersistLoaded, isListsPersistLoaded, isListItemsPersistLoaded] =
      //   await Promise.all([
      //     when(syncedProfiles$.isPersistLoaded),
      //     when(syncedLists$.isPersistLoaded),
      //     when(syncedListItems$.isPersistLoaded),
      //   ]);

      // console.log('Profiles persist loaded:', isProfilePersistLoaded);
      // console.log('Lists persist loaded:', isListsPersistLoaded);
      // console.log('List items persist loaded:', isListItemsPersistLoaded);

      setIsLoading(false);
      return;
    };

    init();
  }, []);

  const segments = useSegments();
  const currentSegment = useMemo(
    () => (segments[segments.length - 1] === '(tabs)' ? 'index' : segments[segments.length - 1]),
    [segments]
  );
  const currentScreenIndex = useMemo(
    () => SCREENS.findIndex((screen) => screen.name === currentSegment),
    [currentSegment]
  );

  const prevScreenIndexRef = useRef(currentScreenIndex);
  const navigationDirection = useMemo(() => {
    const direction = currentScreenIndex > prevScreenIndexRef.current ? 'right' : 'left';
    prevScreenIndexRef.current = currentScreenIndex;
    return direction;
  }, [currentScreenIndex]);

  const screenAnimation: StackAnimationTypes =
    navigationDirection === 'right' ? 'slide_from_right' : 'slide_from_left';

  if (isLoading) return <View className="flex-1 bg-background" />;

  return (
    <View className="relative flex h-full w-full flex-1">
      <Stack screenOptions={{ headerShown: false }} initialRouteName={SCREENS[0].name}>
        {SCREENS.map((screen) => {
          return (
            <Stack.Screen
              key={screen.name}
              name={screen.name}
              options={{
                animation: screenAnimation,
                ...screen.options,
              }}
            />
          );
        })}
      </Stack>
      <BottomNavigation screens={SCREENS} currentSegment={currentSegment} />
    </View>
  );
}
