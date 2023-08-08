import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Toast } from "react-native-toast-message/lib/src/Toast";

import { AuthProvider } from "./context/auth";

import Signed from "./router/signed";
import NoSigned from "./router/noSigned";
import { ColorModeProvider } from "./context/colorMode";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <ColorModeProvider>
        <AuthProvider>
          {({ auth }) =>
            auth ? <Signed Stack={Stack} /> : <NoSigned Stack={Stack} />
          }
        </AuthProvider>
        <Toast />
      </ColorModeProvider>
    </NavigationContainer>
  );
}
