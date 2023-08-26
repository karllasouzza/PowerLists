import React, { createContext, useState } from "react";
import { Appearance } from "react-native";

import theme from "../assets/theme.json";

const Portal = createContext();

export const ColorModeProvider = ({ children }) => {
  const [userTheme, setUserTheme] = useState(false);



  return (
    <Portal.Provider value={{  }}>
      {children}
    </Portal.Provider>
  );
};
export default Portal;
