import * as Linking from "expo-linking";


import { Toast } from "react-native-toast-message/lib/src/Toast";

import { AuthProvider } from "./context/auth";

import NoSigned from "./router/noSigned";
import Signed from "./router/signed";
import { useColorScheme } from "react-native";

const Stack = createNativeStackNavigator();

const main = () => {
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
      linking={linking}
    >
      <PaperProvider theme={dark ? CombinedDarkTheme : CombinedDefaultTheme}>
        <AuthProvider>
          {({ auth }) =>
            auth ? (
              <Signed
                Stack={Stack}
                theme={dark ? CombinedDarkTheme : CombinedDefaultTheme}
              />
            ) : (
              <NoSigned
                Stack={Stack}
                theme={dark ? CombinedDarkTheme : CombinedDefaultTheme}
              />
            )
          }
        </AuthProvider>
        <Toast />
      </PaperProvider>
    </NavigationContainer>
  );
};


export default main