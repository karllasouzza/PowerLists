import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Toast } from "react-native-toast-message/lib/src/Toast";

import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "./context/auth";

import NoSigned from "./router/noSigned";
import BottomNavigation from "./components/BottomNavigation";
import * as Linking from "expo-linking";
import { MenuContextProvider } from "./context/menu-provider";

const Stack = createNativeStackNavigator();

export default () => {
  const prefix = Linking.createURL();
  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        PasswordRecovery: {
          path: "recovery",
        },
      },
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <PaperProvider>
        <AuthProvider>
          {({ auth }) =>
            auth ? (
              <MenuContextProvider>
                <BottomNavigation />
              </MenuContextProvider>
            ) : (
              <NoSigned Stack={Stack} />
            )
          }
        </AuthProvider>
        <Toast />
      </PaperProvider>
    </NavigationContainer>
  );
};
