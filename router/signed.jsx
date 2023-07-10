import React from "react";
import Home from "../pages/Home";
import List from "../pages/List";

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
        initialParams={{ lists_id: null }}
      />
      <Stack.Screen
        name='Account'
        component={Home}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
