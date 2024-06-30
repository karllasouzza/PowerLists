import { useIsFocused } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import { useTheme } from "react-native-paper";
import { useColorScheme } from "react-native";
import * as NavigationBar from "expo-navigation-bar";

export default function FocusAwareStatusBar({ color, navColor }) {
  const isFocused = useIsFocused();
  const theme = useTheme();
  const colorScheme = useColorScheme();

  NavigationBar.setBackgroundColorAsync(navColor ? navColor : color);

  return isFocused ? (
    <StatusBar
      barStyle={colorScheme === "light" ? "light-content" : "dark-content"}
      backgroundColor={color ? color : theme.colors.surface}
    />
  ) : null;
}
