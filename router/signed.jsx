import React from "react";
import Home from "../pages/Home";
import List from "../pages/ListItems";
import Account from "../pages/Account";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";

const Stack = createMaterialBottomTabNavigator();

export default () => {
  return (
    <Stack.Navigator shifting>
      <Stack.Screen
        name='Home'
        component={Home}
        options={{
          headerShown: false,
          tabBarLabel: "Listas",
          tabBarIcon: ({ color, focused }) => {
            return (
              <Icon
                name={!focused ? "file-document-outline" : "file-document"}
                size={24}
                color={color}
              />
            );
          },
        }}
      />
      <Stack.Screen
        name='Account'
        component={Account}
        options={{
          headerShown: false,
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, focused }) => {
            return (
              <Icon
                name={!focused ? "account-outline" : "account"}
                size={24}
                color={color}
              />
            );
          },
        }}
      />
    </Stack.Navigator>
  );
};
