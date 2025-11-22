import { View } from 'react-native';
import { useTheme } from '@/context/themes/themes';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Label } from '@/components/ui/label';

export default function CustomizationPage() {
  const { theme, colorScheme, setTheme, setColorScheme } = useTheme();

  return (
    <View className="flex h-full w-full items-center justify-center gap-4 bg-background">
      <Text className="text-2xl font-bold text-foreground">Login Page</Text>

      <View className="gap-2">
        <Text className="text-primary">Primary Color</Text>
        <Text className="text-secondary">Secondary Color</Text>
        <Text className="text-muted-foreground">Muted Text</Text>
      </View>

      <View className="flex-row gap-2">
        <Label>Tema:</Label>
        <View className="**:first:rounded-r-none **:first:border-r-0 flex flex-row gap-0">
          <Button
            variant={colorScheme === 'light' ? 'default' : 'outline'}
            onPress={() => setColorScheme('light')}>
            <Text>Claro</Text>
          </Button>
          <Button
            variant={colorScheme === 'dark' ? 'default' : 'outline'}
            onPress={() => setColorScheme('dark')}>
            <Text>Escuro</Text>
          </Button>
        </View>
      </View>
      <View className="gap-2">
        <Button
          variant="secondary"
          onPress={() => setTheme(theme === 'default' ? 'purple' : 'default')}>
          <Text>Switch Theme: {theme}</Text>
        </Button>
      </View>
    </View>
  );
}
