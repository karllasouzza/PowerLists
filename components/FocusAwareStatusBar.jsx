import { useContext } from "react";
import { useIsFocused } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import ColorModeContext from "../context/colorMode";

export default function FocusAwareStatusBar({ color }) {
  const isFocused = useIsFocused();
  const { colorScheme, theme } = useContext(ColorModeContext);

  return isFocused ? (
    <StatusBar
      barStyle={colorScheme === "light" ? "light-content" : "dark-content"}
      backgroundColor={color ? color : theme.schemes[colorScheme].surfaceDim}
    />
  ) : null;
}
