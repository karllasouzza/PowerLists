import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';

import { ThemeProviderPropsT } from './use-themes.types';
import { mmkvStorage } from '@/data/storage';
import { themes } from './themeConfig';
import FocusAwareStatusBar from '@/components/focus-aware-status-bar';
import { ThemeContext } from './theme-context';

const ThemeProvider = ({ children, name, customColorScheme }: ThemeProviderPropsT) => {
  const { colorScheme: systemColorScheme, setColorScheme: setNativeWindColorScheme } =
    useColorScheme();
  const [theme, setTheme] = useState<keyof typeof themes>(name || 'default');
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(
    customColorScheme || (systemColorScheme as 'light' | 'dark') || 'light'
  );

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

  const contextValue = useMemo(
    () => ({
      theme,
      colorScheme: scheme,
      setTheme: handleSetThemeAndSaveOnStorage,
      setColorScheme: handleSetColorSchemeAndSaveOnStorage,
    }),
    [theme, scheme, handleSetThemeAndSaveOnStorage, handleSetColorSchemeAndSaveOnStorage]
  );

  const statusBarBackgroundColor = useMemo(() => {
    const themeVars = themes[theme][scheme];
    // Extrai a cor do background das variáveis CSS
    return themeVars['--color-background'] || (scheme === 'dark' ? '#0a0a0a' : '#ffffff');
  }, [theme, scheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <FocusAwareStatusBar color={statusBarBackgroundColor} />
      <View className="h-full w-full bg-background" style={themes[theme][scheme]}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

export { useTheme } from './theme-context';
export default ThemeProvider;
