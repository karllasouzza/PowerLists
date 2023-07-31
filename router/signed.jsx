import React from "react";
import Home from "../pages/Home";
import List from "../pages/ListItems";
import Account from "../pages/Account";

export default ({ Stack }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Home'
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='Add'
        component={List}
        options={{
          headerShown: false,
        }}
        initialParams={{ list: null }}
      />
      <Stack.Screen
        name='Account'
        component={Account}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
