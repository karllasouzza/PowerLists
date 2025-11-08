import React from 'react';
import Home from '../features/home';
import Account from '../features/account';

import ListItems from '../features/home/ListItems';

export default ({ Stack, theme }) => {
  return (
    <Stack.Navigator theme={theme}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="List"
        component={ListItems}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Account"
        component={Account}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
