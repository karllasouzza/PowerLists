import React from "react";
import { useIsFocused } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import theme from "../assets/theme.json";

export default function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar barStyle='light-content' backgroundColor={theme.palettes.neutral[99]}  /> : null;
}
