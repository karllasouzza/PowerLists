import { Stack } from 'expo-router';
import { PortalHost } from '@rn-primitives/portal';
import { verifyInstallation } from 'nativewind';
import { Toaster } from 'sonner-native';
import { useEffect } from 'react';

import ThemeProvider from '@/context/themes/use-themes';
import { useAuthStore } from '@/stores/auth';
import '@/css/global.css';

export default function RootLayout() {
  verifyInstallation();

  const initialize = useAuthStore((state) => state.initialize);

  // Inicializa o auth store quando o app carrega
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <ThemeProvider name="default">
      <Stack initialRouteName="login">
        <Stack.Screen name="loading" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        {/* <Stack.Screen name="create-account" options={{ headerShown: false }} />
        <Stack.Screen name="reset-password" options={{ headerShown: false }} /> */}
      </Stack>
      <PortalHost />
      <Toaster />
    </ThemeProvider>
  );
}
