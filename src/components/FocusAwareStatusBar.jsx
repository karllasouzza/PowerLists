import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import { useTheme } from "react-native-paper";
import { useColorScheme } from "react-native";
import * as NavigationBar from "expo-navigation-bar";

export default function FocusAwareStatusBar({ color, navColor }) {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  useFocusEffect(() => {
    NavigationBar.setBackgroundColorAsync(navColor ? navColor : color);
    NavigationBar.setButtonStyleAsync(
      colorScheme === "light" ? "dark" : "light"
    );
  });

  return (
    <StatusBar
      barStyle={colorScheme === "light" ? "dark-content" : "light-content"}
      backgroundColor={color ? color : theme.colors.surface}
    />
  );
}
