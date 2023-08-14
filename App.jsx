import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Toast } from "react-native-toast-message/lib/src/Toast";

import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "./context/auth";

import Signed from "./router/signed";
import NoSigned from "./router/noSigned";
import { ColorModeProvider } from "./context/colorMode";
import BottomNavigation from "./components/BottomNavigation";

const Stack = createNativeStackNavigator();

export default () => {
  return (
    <NavigationContainer>
      <ColorModeProvider>
        <PaperProvider>
          <AuthProvider>
            {({ auth }) =>
              auth ? <BottomNavigation /> : <NoSigned Stack={Stack} />
            }
          </AuthProvider>
          <Toast />
          {/*  */}
        </PaperProvider>
      </ColorModeProvider>
    </NavigationContainer>
  );
};
