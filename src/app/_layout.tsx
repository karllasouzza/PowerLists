import { Stack, useRouter, useSegments } from 'expo-router';
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

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const initilizeDatabase = async () => {
      await initialize();
    };

    initilizeDatabase();
  }, [initialize]);

  useEffect(() => {
    if (isLoading) return;

    const inTabsGroup = segments[0] === '(tabs)';

    if (!user && inTabsGroup) {
      // Redirect to the index page if the user is not authenticated and trying to access the tabs
      router.replace('/');
    } else if (user && !inTabsGroup) {
      // Redirect to the home page if the user is authenticated and not in the tabs
      router.replace('/(tabs)/index');
    }
  }, [user, isLoading, segments, router]);

  if (isLoading) {
    return <LoadingPage />;
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
