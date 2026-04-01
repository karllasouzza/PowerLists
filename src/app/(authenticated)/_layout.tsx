import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { NativeTabs, Icon, Label, VectorIcon } from 'expo-router/unstable-native-tabs';

import { useTheme } from '@/context/themes';
import { rawColors } from '@/context/themes/theme-config';

const hsl = (raw: string) => {
  const [h, s, l] = raw.split(' ');
  return `hsl(${h}, ${s}, ${l})`;
};

const hsla = (raw: string, alpha: number) => {
  const [h, s, l] = raw.split(' ');
  return `hsla(${h}, ${s}, ${l}, ${alpha})`;
};

export default function AuthenticatedLayout() {
  const { theme, colorScheme } = useTheme();

  const palette = rawColors[theme]?.[colorScheme] ?? rawColors.default[colorScheme];
  const bg = hsl(palette['--color-bottom-bar']);
  const tint = hsl(palette['--color-bottom-bar-accent']);
  const fgMuted = hsla(palette['--color-bottom-bar-foreground'], 0.55);

  return (
    <NativeTabs
      backgroundColor={bg}
      tintColor={tint}
      iconColor={{ default: fgMuted, selected: tint }}
      labelStyle={{
        default: { color: fgMuted },
        selected: { color: tint, fontWeight: '600' },
      }}>
      <NativeTabs.Trigger name="index">
        <Icon
          src={{
            default: <VectorIcon family={MaterialCommunityIcons} name="home-outline" />,
            selected: <VectorIcon family={MaterialCommunityIcons} name="home" />,
          }}
        />
        <Label>Listas</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="account">
        <Icon
          src={{
            default: <VectorIcon family={MaterialCommunityIcons} name="account-outline" />,
            selected: <VectorIcon family={MaterialCommunityIcons} name="account" />,
          }}
        />
        <Label>Conta</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
