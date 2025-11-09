import { View, Text, Pressable } from 'react-native';
import { useTheme } from '@/context/themes/themes';

export default function LoadingPage() {
  const { theme, colorScheme, setTheme, setColorScheme } = useTheme();

  return (
    <View className="flex h-full w-full items-center justify-center gap-4 bg-background">
      <Text className="text-2xl font-bold text-foreground">Login Page</Text>

      <View className="gap-2">
        <Text className="text-primary">Primary Color</Text>
        <Text className="text-secondary">Secondary Color</Text>
        <Text className="text-muted-foreground">Muted Text</Text>
      </View>

      <View className="gap-2">
        <Pressable
          className="rounded-lg bg-primary px-4 py-2"
          onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}>
          <Text className="text-primary-foreground">Toggle Theme: {colorScheme}</Text>
        </Pressable>

        <Pressable
          className="rounded-lg bg-secondary px-4 py-2"
          onPress={() => setTheme(theme === 'default' ? 'purple' : 'default')}>
          <Text className="text-secondary-foreground">Switch Theme: {theme}</Text>
        </Pressable>
      </View>

      <View className="rounded-lg border border-border bg-card p-4">
        <Text className="text-card-foreground">Card Example</Text>
      </View>
    </View>
  );
}
