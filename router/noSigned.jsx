import React from "react";
import Auth from "../pages/Auth";
import Login from "../pages/Auth/Login";
import CreateAccount from "../pages/Auth/CreateAccount";
import PasswordRecovery from "../pages/Auth/PasswordRecovery";
import { useTheme } from "react-native-paper";

export default ({ Stack }) => {
  const theme = useTheme();

  return (
    <Stack.Navigator initialRouteName='Auth' theme={theme}>
      <Stack.Screen
        name='Auth'
        component={Auth}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name='CreateAccount'
        component={CreateAccount}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='Login'
        component={Login}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name='PasswordRecovery'
        component={PasswordRecovery}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
