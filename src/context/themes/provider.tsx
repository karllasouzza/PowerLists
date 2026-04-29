import { FocusAwareBars } from "@/components/focus-aware-bars";
import { useValue } from "@legendapp/state/react";
import { useColorScheme } from "nativewind";
import React, { memo, useCallback, useMemo } from "react";
import { Appearance, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserPreferencesContext } from "./context";
import { UserPreferencesProviderProps } from "./types";
import userPreferencesState$, { UserPreferences } from "@/data/states/user-preferences";
import { themes, rawColors } from "@/lib/themes";
import { getThemeColorSafe } from "@/utils/tailwind-color";

/**
 * UserPreferencesProvider component that provides theme context to its children.
 *
 * @param {children}
 */
const UserPreferencesProvider = ({
  children,
}: UserPreferencesProviderProps) => {
  const {
    colorScheme: systemColorScheme,
    setColorScheme: setSystemColorScheme,
  } = useColorScheme();

  const { backgroundColor, colorScheme, theme } = useValue(
    userPreferencesState$,
  );

  const effectiveColorScheme = useMemo(() => {
    const safe = colorScheme || systemColorScheme || "light";
    return safe === "system" ? systemColorScheme || "light" : safe;
  }, [colorScheme, systemColorScheme]);

  const safeThemeName = useMemo(() => theme || "default", [theme]);

  const handleSetColorScheme = useCallback(
    (scheme: UserPreferences["colorScheme"]): boolean => {
      try {
        if (!["light", "dark", "system"].includes(scheme))
          throw new Error("Invalid color scheme");

        setSystemColorScheme(
          scheme === "system"
            ? ((Appearance.getColorScheme() ?? "light") as "light" | "dark")
            : scheme,
        );

        if (scheme === "system") {
          userPreferencesState$.colorScheme.set("system");
        } else if (scheme === "light" || scheme === "dark") {
          userPreferencesState$.colorScheme.set(scheme);
        }

        return true;
      } catch (error) {
        console.error("Error saving color scheme to storage:", error);
        return false;
      }
    },
    [setSystemColorScheme],
  );

  const handleSetThemeName = useCallback(
    (theme: UserPreferences["theme"]): boolean => {
      try {
        if (!themes[theme]) throw new Error("Theme not found");

        userPreferencesState$.theme.set(theme);

        return true;
      } catch (error) {
        console.error("Error saving theme to storage:", error);
        return false;
      }
    },
    [],
  );

  const handleSetBackgroundColor = useCallback(
    (color: UserPreferences["backgroundColor"] | "default"): boolean => {
      try {
        if (!color) throw new Error("Background color is required");

        if (color === "default") {
          userPreferencesState$.backgroundColor.set("--color-background");
        } else {
          userPreferencesState$.backgroundColor.set(color);
        }

        return true;
      } catch (error) {
        console.error("Error saving background color to storage:", error);
        return false;
      }
    },
    [],
  );

  const backgroundColorConverted = useMemo(() => {
    const themeVars = rawColors[safeThemeName][effectiveColorScheme];

    const backgroundColorFallback =
      effectiveColorScheme === "dark" ? "0 0% 0%" : "0 0% 100%";

    const colorVar = backgroundColor || "--color-background";

    const channels = getThemeColorSafe({
      themeVars,
      varName: colorVar,
      fallback: backgroundColorFallback,
    });
    return `hsl(${channels})`;
  }, [safeThemeName, effectiveColorScheme]);

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
    <UserPreferencesContext.Provider value={contextValue}>
      <FocusAwareBars colorScheme={effectiveColorScheme} />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: backgroundColorConverted,
        }}
      >
        <View className="flex-1 h-full w-full" style={themeVars}>
          {children}
        </View>
      </SafeAreaView>
    </UserPreferencesContext.Provider>
  );
};

export default memo(UserPreferencesProvider);
