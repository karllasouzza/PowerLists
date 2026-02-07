import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { PortalHost } from '@rn-primitives/portal';
import { verifyInstallation } from 'nativewind';
import { Toaster } from 'sonner-native';
import BootSplash from 'react-native-bootsplash';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import ThemeProvider from '@/context/themes/use-themes';
import { AnimatedBootSplash } from '@/components/animated-boot-splash';
import '@/css/global.css';
import { useAuthStore } from '@/hooks/use-auth';

export default function RootLayout() {
  verifyInstallation();
  const [visible, setVisible] = React.useState(true);

  const { isLoading, user, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isLoading) {
      BootSplash.hide({ fade: true });
      setVisible(false);
    }
  }, [isLoading]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <ThemeProvider>
          <Stack>
            <Stack.Protected guard={!user}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="create-account" options={{ headerShown: false }} />
              <Stack.Screen name="request-password-recovery" options={{ headerShown: false }} />
              <Stack.Screen name="password-recovery" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Protected guard={!!user}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack.Protected>
          </Stack>
          <PortalHost />
          <Toaster />
          {(isLoading || visible) && (
            <AnimatedBootSplash onAnimationEnd={() => setVisible(false)} />
          )}
        </ThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
