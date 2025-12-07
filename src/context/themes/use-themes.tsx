import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';

import { mmkvStorage } from '@/data/storage';
import { themes } from './theme-config';
import { ThemeContext } from './theme-context';
import { ThemeProviderPropsT } from './use-themes.types';
import { FocusAwareBars, IFocusAwareBarsProps } from '@/components/focus-aware-bars';
import { getTailwindColor, getThemeColorSafe, resolveColor } from '@/utils/tailwind-color.utils';

const ThemeProvider = ({ children, name, customColorScheme }: ThemeProviderPropsT) => {
  const { colorScheme: systemColorScheme, setColorScheme: setNativeWindColorScheme } =
    useColorScheme();
  const [theme, setTheme] = useState<keyof typeof themes>(name || 'default');
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(
    customColorScheme || (systemColorScheme as 'light' | 'dark') || 'light'
  );
  const [navigationBar, setNavigationBar] = useState<IFocusAwareBarsProps['navigationBar'] | null>(
    null
  );
  const [statusBar, setStatusbar] = useState<IFocusAwareBarsProps['statusBar'] | null>(null);

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

  const handleSetStatusBar = useCallback(
    (statusBar: IFocusAwareBarsProps['statusBar']): boolean => {
      try {
        if (!statusBar?.color) {
          throw new Error('Status bar color is required');
        }

        const color = resolveColor(statusBar.color, themes[theme][scheme]);
        const style = statusBar.style || (scheme === 'light' ? 'dark' : 'light');

        setStatusbar({
          color,
          style,
        });
        return true;
      } catch (error) {
        console.error('Error setting status bar:', error);
        return false;
      }
    },
    [scheme, theme]
  );

  const handleSetNavigationBar = useCallback(
    (navigationBar: IFocusAwareBarsProps['navigationBar']): boolean => {
      try {
        if (!navigationBar?.color) {
          throw new Error('Navigation bar color is required');
        }

        const color = resolveColor(navigationBar.color, themes[theme][scheme]);
        const style = navigationBar.style || (scheme === 'light' ? 'dark' : 'light');

        setNavigationBar({
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
      setStatusBar: handleSetStatusBar,
      setNavigationBar: handleSetNavigationBar,
    }),
    [
      theme,
      scheme,
      handleSetStatusBar,
      handleSetNavigationBar,
      handleSetColorSchemeAndSaveOnStorage,
      handleSetThemeAndSaveOnStorage,
    ]
  );

  const defaultBarsProps = useMemo((): IFocusAwareBarsProps => {
    const themeVars = themes[theme][scheme];

    const backgroundColorFallback =
      scheme === 'dark' ? getTailwindColor('black') : getTailwindColor('white');

    const backgroundColor = getThemeColorSafe(
      themeVars,
      '--color-background',
      backgroundColorFallback
    );

    return {
      statusBar: {
        color: backgroundColor,
        style: scheme === 'dark' ? 'light' : 'dark',
      },
      navigationBar: {
        color: backgroundColor,
        style: scheme === 'dark' ? 'light' : 'dark',
      },
    };
  }, [theme, scheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <FocusAwareBars
        statusBar={statusBar || defaultBarsProps.statusBar}
        navigationBar={navigationBar || defaultBarsProps.navigationBar}
      />
      <View className="h-full w-full bg-background" style={themes[theme][scheme]}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

export { useTheme } from './theme-context';
export default ThemeProvider;
