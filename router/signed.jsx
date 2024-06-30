import React from "react";
import Home from "../pages/Home";
import Account from "../pages/Account";

import ListItems from "../pages/Home/ListItems";

export default ({ Stack, theme }) => {
  return (
    <Stack.Navigator theme={theme}>
      <Stack.Screen
        name='Home'
        component={Home}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name='List'
        component={ListItems}
        options={{
          headerShown: false,
        }}
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
