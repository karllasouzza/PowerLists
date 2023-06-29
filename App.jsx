import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

import theme from "./assets/theme.json";
import Login from "./pages/Auth/Login";
const MyTheme = {
  dark: false,
  colors: {
    primary: theme.palettes.tertiary[80],
    background: theme.palettes.neutral[99],
    card: theme.palettes.primary[15],
    text: theme.palettes.neutral[45],
    border: theme.palettes.neutral[99],
    notification: theme.palettes.error[80],
  },
};

export default function App() {
  const [user, setUser] = useState(false);
  return (
    <NavigationContainer theme={MyTheme}>
      {!user ? (
        <Stack.Navigator initialRouteName='Auth'>
          <Stack.Screen
            name='Auth'
            component={Auth}
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
        </Stack.Navigator>
      ) : (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              if (route.name === "Home") {
                return (
                  <Ionicons
                    name={focused ? "home" : "home-outline"}
                    size={size}
                    color={color}
                  />
                );
              } else if (route.name === "Add") {
                return (
                  <Ionicons
                    name={focused ? "add" : "add-outline"}
                    size={size}
                    color={color}
                  />
                );
              } else if (route.name === "Account") {
                return (
                  <Ionicons
                    name={focused ? "person" : "person-outline"}
                    size={size}
                    color={color}
                  />
                );
              }
            },
            headerShown: false,
            tabBarActiveTintColor: theme.palettes.primary[80],
            tabBarInactiveTintColor: theme.palettes.neutral[80],
          })}>
          <Tab.Screen name='Home' component={Home} />
          <Tab.Screen name='Add' component={Home} />
          <Tab.Screen name='Account' component={Home} />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
}
