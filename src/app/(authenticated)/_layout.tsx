import { useEffect, useMemo, useRef } from 'react';
import { Stack, useSegments, usePathname } from 'expo-router';
import {
  IconHome,
  IconHomeFilled,
  IconUser,
  IconUserFilled,
} from '@tabler/icons-react-native';

import BottomNavigation from '@/components/bottom-bar-nav';

const SCREENS = [
  {
    name: 'index',
    label: 'Listas',
    href: '/',
    icon: { default: IconHome, filled: IconHomeFilled },
  },
  {
    name: 'account',
    label: 'Conta',
    href: '/account',
    icon: { default: IconUser, filled: IconUserFilled },
  },
];

const TAB_NAMES = new Set(SCREENS.map((s) => s.name));
const TAB_INDEX_BY_NAME = SCREENS.reduce<Record<string, number>>((acc, screen, index) => {
  acc[screen.name] = index;
  return acc;
}, {});

export default function AuthenticatedLayout() {
  const segments = useSegments();
  const pathname = usePathname();
  const previousTabRef = useRef<string | null>(null);

  const currentTab = useMemo(() => {
    const allSegments = segments as string[];
    const innerSegment = allSegments[1];
    if (!innerSegment || innerSegment === '(authenticated)') return 'index';
    if (TAB_NAMES.has(innerSegment)) return innerSegment;
    return 'index';
  }, [segments]);

  const tabAnimation = useMemo(() => {
    const previousTab = previousTabRef.current;

    // Avoid transition animation on first mount and when there is no actual tab change.
    if (!previousTab || previousTab === currentTab) return 'none';

    const previousIndex = TAB_INDEX_BY_NAME[previousTab];
    const currentIndex = TAB_INDEX_BY_NAME[currentTab];

    if (previousIndex === undefined || currentIndex === undefined) return 'none';

    return currentIndex > previousIndex ? 'slide_from_right' : 'slide_from_left';
  }, [currentTab]);

  useEffect(() => {
    previousTabRef.current = currentTab;
  }, [currentTab]);

  // Hide the bottom bar when navigating into detail screens (e.g. lists/[id])
  const showBottomBar = useMemo(() => {
    return !pathname.includes('/lists/');
  }, [pathname]);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}>
        <Stack.Screen
          name="index"
          options={{ animation: tabAnimation, animationTypeForReplace: 'push' }}
        />
        <Stack.Screen
          name="account"
          options={{ animation: tabAnimation, animationTypeForReplace: 'push' }}
        />
        <Stack.Screen name="lists" options={{ animation: 'slide_from_bottom' }} />
      </Stack>

      {showBottomBar && <BottomNavigation screens={SCREENS} currentSegment={currentTab} />}
    </>
  );
}
