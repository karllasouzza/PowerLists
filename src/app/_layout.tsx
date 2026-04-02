import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { PortalHost } from '@rn-primitives/portal';
import { Toaster } from 'sonner-native';
import BootSplash from 'react-native-bootsplash';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import ThemeProvider from '@/context/themes/use-themes';
import { useAuth } from '@/hooks/use-auth';
import { AnimatedBootSplash } from '@/components/animated-boot-splash';
import { ErrorBoundary } from '@/components/error-boundary';
import { useAppFonts } from '@/utils/fonts';
import '@/css/global.css';

export default function RootLayout() {
  const [visible, setVisible] = useState(true);

  const { isLoading, user, fetchUserDataAsync } = useAuth();
  const fontsLoaded = useAppFonts();

  useEffect(() => {
    fetchUserDataAsync();
    // Intentionally run only once on mount to avoid repeated state updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading && fontsLoaded) {
      BootSplash.hide({ fade: true });
    }
  }, [isLoading, fontsLoaded]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <ThemeProvider>
          <ErrorBoundary>
            <Stack screenOptions={{ contentStyle: { backgroundColor: 'transparent' } }}>
              <Stack.Protected guard={!user}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="auth" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="create-account" options={{ headerShown: false }} />
                <Stack.Screen name="request-password-recovery" options={{ headerShown: false }} />
                <Stack.Screen name="password-recovery" options={{ headerShown: false }} />
              </Stack.Protected>
              <Stack.Protected guard={!!user}>
                <Stack.Screen name="(authenticated)" options={{ headerShown: false }} />
              </Stack.Protected>
            </Stack>
            <PortalHost />
            <Toaster />
            {(!fontsLoaded || visible) && (
              <AnimatedBootSplash onAnimationEnd={() => setVisible(false)} />
            )}
          </ErrorBoundary>
        </ThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
