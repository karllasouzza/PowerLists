import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';

import { mmkvStorage } from '@/data/storage';
import { themes, rawColors } from './theme-config';
import { ThemeContext } from './theme-context';
import { ThemeProviderPropsT } from './use-themes.types';
import { FocusAwareBars, IFocusAwareBarsProps } from '@/components/focus-aware-bars';
import { getTailwindColor, getThemeColorSafe, resolveColor } from '@/utils/tailwind-color.utils';
import { SafeAreaView } from 'react-native-safe-area-context';

const ThemeProvider = ({ children, name, customColorScheme }: ThemeProviderPropsT) => {
  const { colorScheme: systemColorScheme, setColorScheme: setNativeWindColorScheme } =
    useColorScheme();
  const [theme, setTheme] = useState<keyof typeof themes>(name || 'default');
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(
    customColorScheme || (systemColorScheme as 'light' | 'dark') || 'light'
  );
  const [bars, setBars] = useState<IFocusAwareBarsProps | null>(null);

  useEffect(() => {
    const loadStoredPreferences = () => {
      const storedTheme = mmkvStorage.getItem('theme');
      const storedColorScheme = mmkvStorage.getItem('colorScheme');

      if (storedTheme && storedTheme in themes) {
        setTheme(storedTheme as keyof typeof themes);
      }
      if (storedColorScheme && (storedColorScheme === 'light' || storedColorScheme === 'dark')) {
        setColorScheme(storedColorScheme);
        setNativeWindColorScheme(storedColorScheme);
      }
    };

    loadStoredPreferences();
  }, [setNativeWindColorScheme]);

  useEffect(() => {
    setNativeWindColorScheme(colorScheme);
  }, [colorScheme, setNativeWindColorScheme]);

  const scheme = useMemo(
    () => customColorScheme || colorScheme || 'light',
    [colorScheme, customColorScheme]
  );

  const handleSetColorSchemeAndSaveOnStorage = useCallback(
    (scheme: 'light' | 'dark'): boolean => {
      try {
        if (!['light', 'dark'].includes(scheme)) throw new Error('Invalid color scheme');

        mmkvStorage.setItem('colorScheme', scheme);
        setColorScheme(scheme);
        setNativeWindColorScheme(scheme);
        return true;
      } catch (error) {
        console.error('Error saving color scheme to storage:', error);
        return false;
      }
    },
    [setNativeWindColorScheme]
  );

  const handleSetThemeAndSaveOnStorage = useCallback((theme: keyof typeof themes): boolean => {
    try {
      if (!themes[theme]) throw new Error('Theme not found');

      mmkvStorage.setItem('theme', theme);

      setTheme(theme);
      return true;
    } catch (error) {
      console.error('Error saving theme to storage:', error);
      return false;
    }
  }, []);

  const handleSetBars = useCallback(
    (navigationBar: IFocusAwareBarsProps): boolean => {
      try {
        if (!navigationBar?.color) {
          throw new Error('Navigation bar color is required');
        }

        const color = resolveColor(navigationBar.color, rawColors[theme][scheme]);

        const style = navigationBar.style || (scheme === 'light' ? 'dark' : 'light');

        setBars({
          color,
          style,
        });
        return true;
      } catch (error) {
        console.error('Error setting navigation bar:', error);
        return false;
      }
    },
    [scheme, theme]
  );

  const contextValue = useMemo(
    () => ({
      theme,
      colorScheme: scheme,
      setTheme: handleSetThemeAndSaveOnStorage,
      setColorScheme: handleSetColorSchemeAndSaveOnStorage,
      setBars: handleSetBars,
    }),
    [
      theme,
      scheme,
      handleSetBars,
      handleSetColorSchemeAndSaveOnStorage,
      handleSetThemeAndSaveOnStorage,
    ]
  );

  const defaultBarsProps = useMemo((): IFocusAwareBarsProps => {
    const themeVars = rawColors[theme][scheme];

    const backgroundColorFallback =
      scheme === 'dark' ? getTailwindColor('black') : getTailwindColor('white');

    const backgroundColor = getThemeColorSafe(
      themeVars,
      '--color-background',
      backgroundColorFallback
    );

    return {
      color: backgroundColor,
      style: scheme === 'dark' ? 'light' : 'dark',
    };
  }, [theme, scheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <View
        className="h-full w-full"
        style={{
          backgroundColor: bars?.color || defaultBarsProps.color,
        }}>
        <FocusAwareBars style={bars?.style || defaultBarsProps.style} />
        <SafeAreaView>
          <View className="h-full w-full bg-background" style={themes[theme][scheme]}>
            {children}
          </View>
        </SafeAreaView>
      </View>
    </ThemeContext.Provider>
  );
};

export { useTheme } from './theme-context';
export default ThemeProvider;
