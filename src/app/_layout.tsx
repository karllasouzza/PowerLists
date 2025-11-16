import { Stack } from 'expo-router';
import { PortalHost } from '@rn-primitives/portal';
import { verifyInstallation } from 'nativewind';
import { Toaster } from 'sonner-native';

import ThemeProvider from '@/context/themes/themes';
import '@/css/global.css';

export default function RootLayout() {
  verifyInstallation();

  return (
    <ThemeProvider name="default">
      <Stack initialRouteName="loading">
        <Stack.Screen name="loading" options={{ headerShown: false }} />
        {/* <Stack.Screen name="create-account" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="reset-password" options={{ headerShown: false }} /> */}
      </Stack>
      <PortalHost />
      <Toaster />
    </ThemeProvider>
  );
}
