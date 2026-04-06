import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import BootSplash from 'react-native-bootsplash';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Toaster } from 'sonner-native';

import { AnimatedBootSplash } from '@/components/animated-boot-splash';
import ThemeProvider from '@/context/themes/use-themes';
import '@/css/global.css';
import { useAuth } from '@/hooks/use-auth';
import { useUser } from '@/hooks/use-user';
import { useAppFonts } from '@/utils/fonts';
import ErrorBoundary from '@/components/error-boundary';

export default function RootLayout() {
  const [visible, setVisible] = useState(true);

  const { isLoading, fetchUserDataAsync } = useAuth();
  const { user } = useUser();
  const fontsLoaded = useAppFonts();

  useEffect(() => {
    fetchUserDataAsync();
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
