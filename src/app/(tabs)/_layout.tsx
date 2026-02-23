import { useMemo } from 'react';
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { useSegments } from 'expo-router';
import { Text } from 'react-native';
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
    label: 'Home',
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

export default function RootLayout() {
  const segments = useSegments();
  const currentSegment = useMemo(
    () => (segments[segments.length - 1] === '(tabs)' ? 'index' : segments[segments.length - 1]),
    [segments],
  );

  return (
    <Tabs className="relative flex h-full w-full flex-1">
      {/* Render the current tab */}
      <TabSlot />

      {/* Custom bottom navigation UI */}
      <BottomNavigation screens={SCREENS} currentSegment={currentSegment} />

      {/* Hidden TabList to define routes */}
      <TabList style={{ display: 'none' }}>
        {SCREENS.map((screen) => (
          <TabTrigger key={screen.name} name={screen.name} href={screen.href}>
            <Text>{screen.label}</Text>
          </TabTrigger>
        ))}
      </TabList>
    </Tabs>
  );
}
