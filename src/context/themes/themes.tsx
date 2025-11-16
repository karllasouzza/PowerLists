import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { StatusBar, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import * as SecureStore from 'expo-secure-store';
import * as NavigationBar from 'expo-navigation-bar';

import { ThemeProviderPropsT, ThemeContextT } from './types';
import { themes } from './themeConfig';

const ThemeContext = createContext<ThemeContextT | undefined>(undefined);

const ThemeProvider = ({ children, name, customColorScheme }: ThemeProviderPropsT) => {
  const { colorScheme: systemColorScheme, setColorScheme: setNativeWindColorScheme } =
    useColorScheme();
  const [theme, setTheme] = useState<keyof typeof themes>(name || 'default');
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(
    customColorScheme || (systemColorScheme as 'light' | 'dark') || 'light'
  );

  useEffect(() => {
    const loadStoredPreferences = async () => {
      const storedTheme = await SecureStore.getItemAsync('theme', {
        requireAuthentication: false,
      });
      const storedColorScheme = await SecureStore.getItemAsync('colorScheme', {
        requireAuthentication: false,
      });

      if (storedTheme && storedTheme in themes) {
        setTheme(storedTheme as keyof typeof themes);
      }
      if (storedColorScheme && (storedColorScheme === 'light' || storedColorScheme === 'dark')) {
        setColorScheme(storedColorScheme);
        setNativeWindColorScheme(storedColorScheme);
        NavigationBar.setStyle(storedColorScheme);
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

  const handleSetColorSchemeAndSaveOnSecureStorage = useCallback(
    async (scheme: 'light' | 'dark'): Promise<boolean> => {
      try {
        if (!['light', 'dark'].includes(scheme)) throw new Error('Invalid color scheme');

        await SecureStore.setItemAsync('colorScheme', scheme);
        setColorScheme(scheme);
        setNativeWindColorScheme(scheme);
        return true;
      } catch (error) {
        console.error('Error saving color scheme to SecureStore:', error);
        return false;
      }
    },
    [setNativeWindColorScheme]
  );

  const handleSetThemeAndSaveOnSecureStorage = useCallback(
    async (theme: keyof typeof themes): Promise<boolean> => {
      try {
        if (!themes[theme]) throw new Error('Theme not found');

        await SecureStore.setItemAsync('theme', theme, {
          requireAuthentication: false,
        });

        setTheme(theme);
        return true;
      } catch (error) {
        console.error('Error saving theme to SecureStore:', error);
        return false;
      }
    },
    []
  );

  const contextValue = useMemo(
    () => ({
      theme,
      colorScheme: scheme,
      setTheme: handleSetThemeAndSaveOnSecureStorage,
      setColorScheme: handleSetColorSchemeAndSaveOnSecureStorage,
    }),
    [
      theme,
      scheme,
      handleSetThemeAndSaveOnSecureStorage,
      handleSetColorSchemeAndSaveOnSecureStorage,
    ]
  );

  const statusBarBackgroundColor = useMemo(() => {
    const themeVars = themes[theme][scheme];
    // Extrai a cor do background das variáveis CSS
    return themeVars['--color-background'] || (scheme === 'dark' ? '#0a0a0a' : '#ffffff');
  }, [theme, scheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={statusBarBackgroundColor}
      />
      <View className="h-full w-full bg-background" style={themes[theme][scheme]}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
