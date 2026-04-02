import { Stack } from 'expo-router';

export default function ListLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="voice-assistant" />
    </Stack>
  );
}
