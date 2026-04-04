import { Stack } from 'expo-router';

export default function ListLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="assistant"
        options={{
          animation: 'slide_from_bottom',
        }}
      />
    </Stack>
  );
}
