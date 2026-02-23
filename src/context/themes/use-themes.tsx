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
  const [backgroundColor, setBackgroundColor] = useState<string>('--color-background');

  const safeColorScheme = useMemo(
    () => customColorScheme || systemColorScheme || 'light',
    [customColorScheme, systemColorScheme],
  );
  const safeThemeName = useMemo(() => customTheme || 'default', [customTheme]);

  useEffect(() => {
    const loadStoredCustomColorScheme = () => {
      const storedColorScheme = mmkvStorage.getItem('customColorScheme');
      if (storedColorScheme && ['light', 'dark'].includes(storedColorScheme)) {
        setCustomColorScheme(storedColorScheme as 'light' | 'dark');
      } else {
        setCustomColorScheme(null);
        setSystemColorScheme('system');
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
        setBackgroundColor('--color-background');
      }
    };

    loadStoredCustomColorScheme();
    loadStoredCustomTheme();
    loadStoredCustomBackgroundColor();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    [setCustomColorScheme],
  );

  const handleSetThemeName = useCallback((theme: keyof typeof themes): boolean => {
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

  const handleSetBackgroundColor = useCallback((color: string | 'default'): boolean => {
    try {
      if (!color) throw new Error('Background color is required');

      if (color === 'default') {
        setBackgroundColor('--color-background');
      } else {
        setBackgroundColor(color);
      }

      return true;
    } catch (error) {
      console.error('Error saving background color to storage:', error);
      return false;
    }
  }, []);

  const backgroundColorConverted = useMemo(() => {
    const themeVars = rawColors[safeThemeName][safeColorScheme];

    const backgroundColorFallback =
      customColorScheme === 'dark' ? getTailwindColor('black') : getTailwindColor('white');

    const colorVar = backgroundColor || '--color-background';

    return getThemeColorSafe({
      themeVars,
      varName: colorVar,
      fallback: backgroundColorFallback,
    });
  }, [safeThemeName, safeColorScheme, backgroundColor, customColorScheme]);

  const contextValue = useMemo(
    () => ({
      theme: customTheme || 'default',
      colorScheme: safeColorScheme,
      backgroundColor: backgroundColorConverted,
      setTheme: handleSetThemeName,
      setColorScheme: handleSetColorScheme,
      setBackgroundColor: handleSetBackgroundColor,
    }),
    [
      customTheme,
      safeColorScheme,
      backgroundColorConverted,
      handleSetThemeName,
      handleSetColorScheme,
      handleSetBackgroundColor,
    ],
  );

  const themeVars = useMemo(
    () => themes[safeThemeName][safeColorScheme],
    [safeThemeName, safeColorScheme],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <FocusAwareBars colorScheme={safeColorScheme} />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: backgroundColorConverted,
        }}>
        <View className="h-full w-full" style={themeVars}>
          {children}
        </View>
      </SafeAreaView>
    </ThemeContext.Provider>
  );
};

export { useTheme } from './theme-context';
export default ThemeProvider;
