import React from "react";
import Home from "../pages/Home";

export default ({ Stack, auth }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Home'
        component={Home}
        options={{
          headerShown: false,
        }}
        auth={auth}
      />
      <Stack.Screen
        name='Add'
        component={Home}
        options={{
          headerShown: false,
        }}
        auth={auth}
      />
      <Stack.Screen
        name='Account'
        component={Home}
        options={{
          headerShown: false,
        }}
        auth={auth}
      />
    </Stack.Navigator>
  );
};
