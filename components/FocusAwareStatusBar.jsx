import { useContext } from "react";
import { useIsFocused } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import ColorModeContext from "../context/colorMode";
import { useTheme } from "react-native-paper";
import { useColorScheme } from "react-native";

export default function FocusAwareStatusBar({ color }) {
  const isFocused = useIsFocused();
  const theme = useTheme();
  const colorScheme = useColorScheme();

  return isFocused ? (
    <StatusBar
      barStyle={colorScheme === "light" ? "light-content" : "dark-content"}
      backgroundColor={color ? color : theme.colors.surface}
    />
  ) : null;
}
