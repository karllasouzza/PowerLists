import { useIsFocused } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import theme from "../assets/theme.json";

export default function FocusAwareStatusBar({ color }) {
  const isFocused = useIsFocused();

  return isFocused ? (
    <StatusBar
      barStyle='light-content'
      backgroundColor={color ? color : theme.palettes.neutral[99]}
    />
  ) : null;
}
