import { useEffect, useMemo, useRef } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';

import { getProfile } from '@/data/actions/profile';
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
  { name: 'index', label: 'Inicio', icon: { default: IconHome, filled: IconHomeFilled } },
  { name: 'account', label: 'Conta', icon: { default: IconUser, filled: IconUserFilled } },
  {
    name: 'settings',
    label: 'Configurações',
    icon: { default: IconSettings, filled: IconSettingsFilled },
  },
];

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { profile } = await getProfile();
      if (!profile) {
        router.replace('/account');
      }
    };
    init();
  }, [router]);

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
              }}
            />
          );
        })}
      </Stack>
      <BottomNavigation screens={SCREENS} currentSegment={currentSegment} />
    </View>
  );
}
