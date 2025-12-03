import { Redirect, Stack } from 'expo-router';
import { PortalHost } from '@rn-primitives/portal';
import { verifyInstallation } from 'nativewind';
import { Toaster } from 'sonner-native';
import { useEffect } from 'react';

import ThemeProvider from '@/context/themes/use-themes';
import { useAuthStore } from '@/stores/auth';
import '@/css/global.css';
import LoadingPage from './loading';

export default function RootLayout() {
  verifyInstallation();
  const { initialize, isLoading, user } = useAuthStore();

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }
  if (!isLoading && user) {
    return <Redirect href="/(tabs)/index" />;
  }
  return (
    <ThemeProvider name="default">
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        {/* <Stack.Screen name="create-account" options={{ headerShown: false }} />
        <Stack.Screen name="reset-password" options={{ headerShown: false }} /> */}
      </Stack>
      <PortalHost />
      <Toaster />
    </ThemeProvider>
  );
}
