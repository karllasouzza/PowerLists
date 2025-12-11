import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { PortalHost } from '@rn-primitives/portal';
import { verifyInstallation } from 'nativewind';
import { Toaster } from 'sonner-native';
import BootSplash from 'react-native-bootsplash';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import ThemeProvider from '@/context/themes/use-themes';
import { useAuthStore } from '@/stores/auth';
import { AnimatedBootSplash } from '@/components/animated-boot-splash';
import '@/css/global.css';

export default function RootLayout() {
  verifyInstallation();
  const [visible, setVisible] = React.useState(true);

  const { initialize, isLoading, user } = useAuthStore();

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      await initialize();
    };

    init().finally(async () => {
      setVisible(false);
      await BootSplash.hide({ fade: true });
    });
  }, [initialize]);

  useEffect(() => {
    const inTabsGroup = segments[0] === '(tabs)';

    if (!user && inTabsGroup) {
      // Redirect to the index page if the user is not authenticated and trying to access the tabs
      router.replace('/');
    } else if (user && !inTabsGroup) {
      // Redirect to the home page if the user is authenticated and not in the tabs
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments, router]);

  if (isLoading && visible) {
    return <AnimatedBootSplash onAnimationEnd={() => setVisible(false)} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <ThemeProvider name="default">
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="create-account" options={{ headerShown: false }} />
            <Stack.Screen name="request-password-recovery" options={{ headerShown: false }} />
            <Stack.Screen name="password-recovery" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <PortalHost />
          <Toaster />
        </ThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
