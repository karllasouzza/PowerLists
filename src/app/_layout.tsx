import { Stack } from 'expo-router';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { PortalHost } from '@rn-primitives/portal';

import ThemeProvider from '@/context/themes/themes';
import '@/css/global.css';

export default function RootLayout() {
  return (
    <ThemeProvider name="default">
      <Stack initialRouteName="loading">
        <Stack.Screen name="loading" options={{ headerShown: false }} />
        {/* <Stack.Screen name="create-account" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="reset-password" options={{ headerShown: false }} /> */}
      </Stack>
      <PortalHost />
    </ThemeProvider>
  );
}
