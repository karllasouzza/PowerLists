import { useMemo } from 'react';
import { Stack, useSegments, usePathname } from 'expo-router';
import {
  IconHome,
  IconHomeFilled,
  IconUser,
  IconUserFilled,
  IconBookmark,
  IconBookmarkFilled,
  IconCompass,
  IconCompassFilled,
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
    name: 'explore',
    label: 'Explore',
    href: '/explore',
    icon: { default: IconCompass, filled: IconCompassFilled },
  },
  {
    name: 'saved',
    label: 'Saved',
    href: '/saved',
    icon: { default: IconBookmark, filled: IconBookmarkFilled },
  },
  {
    name: 'account',
    label: 'Account',
    href: '/account',
    icon: { default: IconUser, filled: IconUserFilled },
  },
];

const TAB_NAMES = new Set(SCREENS.map((s) => s.name));

export default function AuthenticatedLayout() {
  const segments = useSegments();
  const pathname = usePathname();

  const currentTab = useMemo(() => {
    // segments[0] = '(authenticated)', rest = screen name(s)
    const allSegments = segments as string[];
    const innerSegment = allSegments[1];
    if (!innerSegment || innerSegment === '(authenticated)') return 'index';
    if (TAB_NAMES.has(innerSegment)) return innerSegment;
    return 'index';
  }, [segments]);

  // Hide the bottom bar when navigating into detail screens (e.g. lists/[id])
  const showBottomBar = useMemo(() => {
    return !pathname.includes('/lists/');
  }, [pathname]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="account" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="lists" options={{ animation: 'slide_from_bottom' }} />
      </Stack>

      {showBottomBar && <BottomNavigation screens={SCREENS} currentSegment={currentTab} />}
    </>
  );
}
