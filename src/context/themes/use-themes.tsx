import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Appearance } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { mmkvStorage } from '@/data/storage';
import { FocusAwareBars } from '@/components/focus-aware-bars';
import { getThemeColorSafe } from '@/utils/tailwind-color';
import { themes, rawColors } from './theme-config';
import { ThemeContext } from './theme-context';
import { ThemeProviderProps } from './types';

type UserPreferences = {
  theme: keyof typeof themes;
  colorScheme: 'light' | 'dark' | 'system';
  backgroundColor: string;
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const insets = useSafeAreaInsets();
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    theme: 'default',
    colorScheme: 'system',
    backgroundColor: '--color-background',
  });

  const { colorScheme: systemColorScheme, setColorScheme: setSystemColorScheme } = useColorScheme();

  const effectiveColorScheme = useMemo(() => {
    const safe = userPreferences?.colorScheme || systemColorScheme || 'light';
    return safe === 'system' ? systemColorScheme || 'light' : safe;
  }, [userPreferences, systemColorScheme]);

  const safeThemeName = useMemo(() => userPreferences?.theme || 'default', [userPreferences]);

  useEffect(() => {
    const storedColorScheme = mmkvStorage.getItem('customColorScheme');
    const storedThemeName = mmkvStorage.getItem('customTheme');
    const storedBackgroundColor = mmkvStorage.getItem('customBackgroundColor');

    const colorScheme: UserPreferences['colorScheme'] =
      storedColorScheme && ['light', 'dark'].includes(storedColorScheme)
        ? (storedColorScheme as 'light' | 'dark')
        : 'system';

    const theme: UserPreferences['theme'] =
      storedThemeName && storedThemeName in themes
        ? (storedThemeName as keyof typeof themes)
        : 'default';

    const backgroundColor = storedBackgroundColor ?? '--color-background';

    setUserPreferences({ colorScheme, theme, backgroundColor });
    // 'system' maps to null in Appearance.setColorScheme, which crashes on Android RN 0.83+.
    // For system mode, resolve the current OS scheme to avoid the null call.
    if (colorScheme !== 'system') {
      setSystemColorScheme(colorScheme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetColorScheme = useCallback(
    (scheme: 'light' | 'dark' | 'system'): boolean => {
      try {
        if (!['light', 'dark', 'system'].includes(scheme)) throw new Error('Invalid color scheme');

        // 'system' passes null to native AppearanceModule which crashes on Android RN 0.83+.
        // Use the current OS value as a fallback so NativeWind resets to the actual system scheme.
        setSystemColorScheme(
          scheme === 'system'
            ? ((Appearance.getColorScheme() ?? 'light') as 'light' | 'dark')
            : scheme,
        );

        if (scheme === 'system') {
          setUserPreferences((prev) => ({ ...prev, colorScheme: 'system' }));
          mmkvStorage.removeItem('colorScheme');
        } else if (scheme === 'light' || scheme === 'dark') {
          setUserPreferences((prev) => ({ ...prev, colorScheme: scheme }));
          mmkvStorage.setItem('colorScheme', scheme);
        }

        return true;
      } catch (error) {
        console.error('Error saving color scheme to storage:', error);
        return false;
      }
    },
    [setUserPreferences, setSystemColorScheme],
  );

  const handleSetThemeName = useCallback((theme: UserPreferences['theme']): boolean => {
    try {
      if (!themes[theme]) throw new Error('Theme not found');

      setUserPreferences((prev) => ({ ...prev, theme }));
      mmkvStorage.setItem('theme', theme);

      return true;
    } catch (error) {
      console.error('Error saving theme to storage:', error);
      return false;
    }
  }, []);

  const handleSetBackgroundColor = useCallback(
    (color: UserPreferences['backgroundColor'] | 'default'): boolean => {
      try {
        if (!color) throw new Error('Background color is required');

        if (color === 'default') {
          setUserPreferences((prev) => ({ ...prev, backgroundColor: '--color-background' }));
        } else {
          setUserPreferences((prev) => ({ ...prev, backgroundColor: color }));
        }

        return true;
      } catch (error) {
        console.error('Error saving background color to storage:', error);
        return false;
      }
    },
    [],
  );

  const backgroundColorConverted = useMemo(() => {
    const themeVars = rawColors[safeThemeName][effectiveColorScheme];

    const backgroundColorFallback = effectiveColorScheme === 'dark' ? '0 0% 0%' : '0 0% 100%';

    const colorVar = userPreferences?.backgroundColor || '--color-background';

    const channels = getThemeColorSafe({
      themeVars,
      varName: colorVar,
      fallback: backgroundColorFallback,
    });
    return `hsl(${channels})`;
  }, [safeThemeName, effectiveColorScheme, userPreferences]);

  const contextValue = useMemo(() => {
    return {
      theme: safeThemeName,
      colorScheme: effectiveColorScheme,
      backgroundColor: backgroundColorConverted,
      setTheme: handleSetThemeName,
      setColorScheme: handleSetColorScheme,
      setBackgroundColor: handleSetBackgroundColor,
    };
  }, [
    safeThemeName,
    effectiveColorScheme,
    backgroundColorConverted,
    handleSetThemeName,
    handleSetColorScheme,
    handleSetBackgroundColor,
  ]);

  const themeVars = useMemo(() => {
    return themes[safeThemeName][effectiveColorScheme];
  }, [safeThemeName, effectiveColorScheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <FocusAwareBars
        colorScheme={userPreferences?.colorScheme === 'system' ? 'auto' : effectiveColorScheme}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: backgroundColorConverted,
          paddingTop: insets.top,
          paddingRight: insets.right,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
        }}>
        <View className="h-full w-full" style={themeVars}>
          {children}
        </View>
      </View>
    </ThemeContext.Provider>
  );
}
