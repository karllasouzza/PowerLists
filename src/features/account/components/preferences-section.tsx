import { IconMoon, IconPalette } from '@tabler/icons-react-native';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Option } from '@rn-primitives/select';
import { SettingsRow } from './settings-row';

const COLOR_MODE_OPTIONS: NonNullable<Option>[] = [
  { label: 'Sistema', value: 'system' },
  { label: 'Claro', value: 'light' },
  { label: 'Escuro', value: 'dark' },
];

const THEME_OPTIONS: NonNullable<Option>[] = [
  { label: 'Padrão', value: 'default' },
  { label: 'Roxo', value: 'purple' },
];

type PreferencesSectionProps = {
  colorScheme: 'light' | 'dark';
  theme: 'default' | 'purple';
  onColorSchemeChange: (value: 'light' | 'dark' | 'system') => void;
  onThemeChange: (value: 'default' | 'purple') => void;
};

export function PreferencesSection({
  colorScheme,
  theme,
  onColorSchemeChange,
  onThemeChange,
}: PreferencesSectionProps) {
  const currentColorModeOption = COLOR_MODE_OPTIONS.find((o) => o.value === colorScheme);
  const currentThemeOption = THEME_OPTIONS.find((o) => o.value === theme);

  return (
    <View className="m-4 overflow-hidden flex flex-col gap-3">
      <Text className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
        Preferências
      </Text>

      <View className="rounded-2xl border border-border bg-card">
        <SettingsRow
          icon={IconMoon}
          label="Modo de cor"
          showChevron={false}
          rightContent={
            <Select
              value={currentColorModeOption}
              onValueChange={(option) => {
                if (option) onColorSchemeChange(option.value as 'light' | 'dark' | 'system');
              }}>
              <SelectTrigger className="h-max w-28" size="sm">
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                {COLOR_MODE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} label={opt.label} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />
        <View className="mx-5 border-t border-border" />
        <SettingsRow
          icon={IconPalette}
          label="Tema"
          showChevron={false}
          rightContent={
            <Select
              value={currentThemeOption}
              onValueChange={(option) => {
                if (option) onThemeChange(option.value as 'default' | 'purple');
              }}>
              <SelectTrigger className="h-max w-28" size="sm">
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                {THEME_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} label={opt.label} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />
      </View>
    </View>
  );
}
