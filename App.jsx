import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Toast } from "react-native-toast-message/lib/src/Toast";

import { PaperProvider, useTheme } from "react-native-paper";
import { AuthProvider } from "./context/auth";

import NoSigned from "./router/noSigned";
import BottomNavigation from "./components/BottomNavigation";
import * as Linking from "expo-linking";

const Stack = createNativeStackNavigator();

export default () => {
  const theme = useTheme();

  const prefix = Linking.createURL("https://powerlists.project");
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

  return (
    <NavigationContainer linking={linking}>
      <PaperProvider>
        <AuthProvider>
          {({ auth }) =>
            auth ? <BottomNavigation /> : <NoSigned Stack={Stack} />
          }
        </AuthProvider>
        <Toast />
        {/*  */}
      </PaperProvider>
    </NavigationContainer>
  );
};
