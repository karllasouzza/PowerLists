import { FocusAwareBars } from '@/components/focus-aware-bars';
import * as SecureStore from 'expo-secure-store';
import { useColorScheme } from 'nativewind';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Appearance, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserPreferencesContext } from './context';
import { UserPreferencesProviderProps } from './types';
import { themes, rawColors } from '@/lib/themes';
import { getThemeColorSafe } from '@/utils/tailwind-color';

const USER_PREFS_KEY = 'user_preferences';

type UserPreferences = {
  theme: keyof typeof themes;
  colorScheme: 'light' | 'dark' | 'system';
  backgroundColor: string;
};

const defaultPreferences: UserPreferences = {
  theme: 'default',
  colorScheme: 'system',
  backgroundColor: '--color-background',
};

async function loadPreferences(): Promise<UserPreferences> {
  try {
    const stored = await SecureStore.getItemAsync(USER_PREFS_KEY);
    if (stored) {
      return { ...defaultPreferences, ...JSON.parse(stored) };
    }
  } catch {
    // ignore
  }
  return defaultPreferences;
}

async function savePreferences(prefs: UserPreferences): Promise<void> {
  try {
    await SecureStore.setItemAsync(USER_PREFS_KEY, JSON.stringify(prefs));
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
}

/**
 * UserPreferencesProvider component that provides theme context to its children.
 *
 * @param {children}
 */
const UserPreferencesProvider = ({ children }: UserPreferencesProviderProps) => {
  const { colorScheme: systemColorScheme, setColorScheme: setSystemColorScheme } = useColorScheme();
  const [prefs, setPrefs] = useState<UserPreferences>(defaultPreferences);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadPreferences().then((loadedPrefs) => {
      setPrefs(loadedPrefs);
      setLoaded(true);
    });
  }, []);

  const effectiveColorScheme = useMemo(() => {
    const safe = prefs.colorScheme || systemColorScheme || 'light';
    return safe === 'system' ? systemColorScheme || 'light' : safe;
  }, [prefs.colorScheme, systemColorScheme]);

  const safeThemeName = useMemo(() => prefs.theme || 'default', [prefs.theme]);

  const handleSetColorScheme = useCallback(
    (scheme: UserPreferences['colorScheme']): boolean => {
      try {
        if (!['light', 'dark', 'system'].includes(scheme)) throw new Error('Invalid color scheme');

        setSystemColorScheme(
          scheme === 'system'
            ? ((Appearance.getColorScheme() ?? 'light') as 'light' | 'dark')
            : scheme,
        );

        setPrefs((current) => {
          const next = { ...current, colorScheme: scheme };
          savePreferences(next);
          return next;
        });

        return true;
      } catch (error) {
        console.error('Error saving color scheme to storage:', error);
        return false;
      }
    },
    [setSystemColorScheme],
  );

  const handleSetThemeName = useCallback((theme: UserPreferences['theme']): boolean => {
    try {
      if (!themes[theme]) throw new Error('Theme not found');

      setPrefs((current) => {
        const next = { ...current, theme };
        savePreferences(next);
        return next;
      });

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

        setPrefs((current) => {
          const next = {
            ...current,
            backgroundColor: color === 'default' ? '--color-background' : color,
          };
          savePreferences(next);
          return next;
        });

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

    const colorVar = prefs.backgroundColor || '--color-background';

    const channels = getThemeColorSafe({
      themeVars,
      varName: colorVar,
      fallback: backgroundColorFallback,
    });
    return `hsl(${channels})`;
  }, [safeThemeName, effectiveColorScheme, prefs.backgroundColor]);

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

  if (!loaded) {
    return null;
  }

  return (
    <UserPreferencesContext.Provider value={contextValue}>
      <FocusAwareBars colorScheme={effectiveColorScheme} />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: backgroundColorConverted,
        }}>
        <View className="flex-1 h-full w-full" style={themeVars}>
          {children}
        </View>
      </SafeAreaView>
    </UserPreferencesContext.Provider>
  );
};

export default memo(UserPreferencesProvider);
