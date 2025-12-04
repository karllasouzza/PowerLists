import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import * as NavigationBar from 'expo-navigation-bar';
import { useTheme } from '@/context/themes/theme-context';
import { themes } from '@/context/themes/theme-config';

interface FocusAwareStatusBarProps {
  color?: string;
}

export default function FocusAwareStatusBar({ color }: FocusAwareStatusBarProps) {
  const { colorScheme, theme } = useTheme();

  useFocusEffect(() => {
    NavigationBar.setBackgroundColorAsync(
      color || themes[theme][colorScheme]['--color-background']
    );
    NavigationBar.setButtonStyleAsync(colorScheme === 'light' ? 'dark' : 'light');
  });

  return (
    <StatusBar
      style={colorScheme === 'light' ? 'dark' : 'light'}
      backgroundColor={color || themes[theme][colorScheme]['--color-background']}
    />
  );
}
