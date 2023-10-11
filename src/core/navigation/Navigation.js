import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  NavigationBottom as NavBottom,
  headerTitle,
} from '@nav/NavigationBottom';
import AddNewDeviceScreen from '@screens/settings/addNewDevice';

const Stack = createNativeStackNavigator();
const NavMain = props => {
  return (
    <Stack.Navigator {...props}>
      <Stack.Screen
        name="NavBottom"
        options={{headerShown: false}}
        component={NavBottom}
      />
      <Stack.Screen
        name="AddNewDeviceScreen"
        component={AddNewDeviceScreen}
        initialParams={{
          scroll: true,
        }}
        options={{
          tabBarStyle: {
            display: 'none',
          },
          headerBackTitle: 'Back',
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitle,
        }}
      />
    </Stack.Navigator>
  );
};

export default NavMain;
