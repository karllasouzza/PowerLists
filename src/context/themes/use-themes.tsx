import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';

import { mmkvStorage } from '@/data/storage';
import { themes, rawColors } from './theme-config';
import { ThemeContext } from './theme-context';
import { ThemeProviderProps } from './types';
import { FocusAwareBars } from '@/components/focus-aware-bars';
import { getTailwindColor, getThemeColorSafe } from '@/utils/tailwind-color';
import { SafeAreaView } from 'react-native-safe-area-context';

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { colorScheme: systemColorScheme, setColorScheme: setSystemColorScheme } = useColorScheme();

  const [customTheme, setCustomTheme] = useState<keyof typeof themes | null>(null);
  const [customColorScheme, setCustomColorScheme] = useState<'light' | 'dark' | null>(null);

  const safeColorScheme = useMemo(
    () => customColorScheme || systemColorScheme || 'light',
    [customColorScheme, systemColorScheme]
  );

  const DefaultBackgroundColor = useMemo((): string => {
    const themeVars = rawColors[customTheme || 'default'][safeColorScheme];

    const backgroundColorFallback =
      customColorScheme === 'dark' ? getTailwindColor('black') : getTailwindColor('white');

    const backgroundColor = getThemeColorSafe(
      themeVars,
      '--color-background',
      backgroundColorFallback
    );

    return backgroundColor;
  }, [customTheme, customColorScheme, safeColorScheme]);
  const [backgroundColor, setBackgroundColor] = useState<string>(DefaultBackgroundColor);

  useEffect(() => {
    const loadStoredCustomColorScheme = () => {
      const storedColorScheme = mmkvStorage.getItem('customColorScheme');
      if (storedColorScheme && ['light', 'dark'].includes(storedColorScheme)) {
        setCustomColorScheme(storedColorScheme as 'light' | 'dark');
        setSystemColorScheme(storedColorScheme as 'light' | 'dark');
      } else {
        setCustomColorScheme(null);
        setSystemColorScheme(systemColorScheme as 'light' | 'dark');
      }
    };

    const loadStoredCustomTheme = () => {
      const storedThemeName = mmkvStorage.getItem('customTheme');
      if (storedThemeName && storedThemeName in themes) {
        setCustomTheme(storedThemeName as keyof typeof themes);
      } else {
        setCustomTheme(null);
      }
    };

    const loadStoredCustomBackgroundColor = () => {
      const storedCustomBackgroundColor = mmkvStorage.getItem('customBackgroundColor');
      if (storedCustomBackgroundColor) {
        setBackgroundColor(storedCustomBackgroundColor);
      } else {
        setBackgroundColor(DefaultBackgroundColor);
      }
    };

    loadStoredCustomColorScheme();
    loadStoredCustomTheme();
    loadStoredCustomBackgroundColor();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemColorScheme]);

  const handleSetColorScheme = useCallback(
    (scheme: 'light' | 'dark' | 'system'): boolean => {
      try {
        if (!['light', 'dark', 'system'].includes(scheme)) throw new Error('Invalid color scheme');

        if (scheme === 'system') {
          setCustomColorScheme(null);
          mmkvStorage.removeItem('colorScheme');
        } else if (scheme === 'light' || scheme === 'dark') {
          setCustomColorScheme(scheme);
          mmkvStorage.setItem('colorScheme', scheme);
        }

        return true;
      } catch (error) {
        console.error('Error saving color scheme to storage:', error);
        return false;
      }
    },
    [setCustomColorScheme]
  );

  const handleSetTheme = useCallback((theme: keyof typeof themes): boolean => {
    try {
      if (!themes[theme]) throw new Error('Theme not found');

      if (theme === 'default') {
        mmkvStorage.removeItem('colorScheme');
        setCustomColorScheme(null);
      } else if (theme in themes) {
        setCustomTheme(theme);
        mmkvStorage.setItem('theme', theme);
      }

      return true;
    } catch (error) {
      console.error('Error saving theme to storage:', error);
      return false;
    }
  }, []);

  const handleSetBackgroundColor = useCallback(
    (color: string | 'default'): boolean => {
      try {
        if (!color) throw new Error('Background color is required');

        if (color === 'default') {
          mmkvStorage.removeItem('customBackgroundColor');
          setBackgroundColor(DefaultBackgroundColor);
        } else {
          setBackgroundColor(color);
          mmkvStorage.setItem('customBackgroundColor', color);
        }

        return true;
      } catch (error) {
        console.error('Error saving background color to storage:', error);
        return false;
      }
    },
    [DefaultBackgroundColor]
  );

  const contextValue = useMemo(
    () => ({
      theme: customTheme || 'default',
      colorScheme: safeColorScheme,
      backgroundColor,
      setTheme: handleSetTheme,
      setColorScheme: handleSetColorScheme,
      setBackgroundColor: handleSetBackgroundColor,
    }),
    [
      customTheme,
      safeColorScheme,
      backgroundColor,
      handleSetTheme,
      handleSetColorScheme,
      handleSetBackgroundColor,
    ]
  );

  const theme = useMemo(
    () => themes[customTheme || 'default'][safeColorScheme],
    [customTheme, safeColorScheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <View
        className="h-full w-full"
        style={{ backgroundColor: backgroundColor || DefaultBackgroundColor }}>
        <FocusAwareBars colorScheme={safeColorScheme} />
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: backgroundColor || DefaultBackgroundColor,
          }}>
          <View className="h-full w-full" style={theme}>
            {children}
          </View>
        </SafeAreaView>
      </View>
    </ThemeContext.Provider>
  );
};

export { useTheme } from './theme-context';
export default ThemeProvider;
