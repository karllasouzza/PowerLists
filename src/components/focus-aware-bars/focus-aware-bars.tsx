import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import * as NavigationBar from 'expo-navigation-bar';
import { useTheme } from '@/context/themes/theme-context';
import { themes } from '@/context/themes/theme-config';
import { IFocusAwareBarsProps } from './focus-aware-bars.types';

export const FocusAwareBars = ({ statusBar, navigationBar }: IFocusAwareBarsProps) => {
  const { colorScheme, theme } = useTheme();

  useFocusEffect(() => {
    NavigationBar.setBackgroundColorAsync(
      navigationBar?.color || themes[theme][colorScheme]['--color-background']
    );
    NavigationBar.setButtonStyleAsync(
      navigationBar?.style || colorScheme === 'light' ? 'dark' : 'light'
    );
  });

  return (
    <StatusBar
      style={statusBar?.style || colorScheme === 'light' ? 'dark' : 'light'}
      backgroundColor={statusBar?.color || themes[theme][colorScheme]['--color-background']}
    />
  );
};
