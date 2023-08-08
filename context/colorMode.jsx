import React, { createContext, useState } from "react";
import { Appearance } from "react-native";

import theme from "../assets/theme.json";

const ColorModeContext = createContext();

export const ColorModeProvider = ({ children }) => {
  Appearance.addChangeListener(() =>
    Appearance.setColorScheme(Appearance.getColorScheme())
  );
  const colorScheme = Appearance.getColorScheme();
  const setColorScheme = () => {
    Appearance.setColorScheme(colorScheme === "light" ? "dark" : "light");
  };

  return (
    <ColorModeContext.Provider value={{ colorScheme, setColorScheme, theme }}>
      {children}
    </ColorModeContext.Provider>
  );
};
export default ColorModeContext;
