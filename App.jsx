import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Toast } from "react-native-toast-message/lib/src/Toast";

import { PaperProvider, useTheme } from "react-native-paper";
import { AuthProvider } from "./context/auth";

import NoSigned from "./router/noSigned";
import Signed from "./router/signed";
import * as Linking from "expo-linking";

import {
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
} from "react-native-paper";
import { useColorScheme } from "react-native";

const Stack = createNativeStackNavigator();

export default () => {
  const prefix = Linking.createURL();
  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        PasswordRecovery: {
          path: "PasswordRecovery",
        },
      },
    },
  };

  const dark = useColorScheme() === "dark";
  console.log(dark);

  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

  const CombinedDefaultTheme = {
    ...MD3LightTheme,
    ...LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      ...LightTheme.colors,
    },
  };
  const CombinedDarkTheme = {
    ...MD3DarkTheme,
    ...DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      ...DarkTheme.colors,
    },
  };

  return (
    <NavigationContainer
      theme={dark ? CombinedDarkTheme : CombinedDefaultTheme}
      linking={linking}>
      <PaperProvider theme={dark ? CombinedDarkTheme : CombinedDefaultTheme}>
        <AuthProvider>
          {({ auth }) =>
            auth ? <Signed Stack={Stack} theme={dark ? CombinedDarkTheme : CombinedDefaultTheme} /> : <NoSigned Stack={Stack} theme={dark ? CombinedDarkTheme : CombinedDefaultTheme} />
          }
        </AuthProvider>
        <Toast />
      </PaperProvider>
    </NavigationContainer>
  );
};
