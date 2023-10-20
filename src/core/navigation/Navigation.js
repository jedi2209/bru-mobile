import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  NavigationBottom as NavBottom,
  headerTitle,
} from '@nav/NavigationBottom';
import AddNewDeviceScreen from '@screens/settings/addNewDevice';
import UpdateFirmwareScreen from '@screens/settings/updateFirmware';
import UpdateFirmwareProgressScreen from '@screens/settings/updateFirmwareProgress';

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
      <Stack.Screen
        name="UpdateFirmwareScreen"
        component={UpdateFirmwareScreen}
        initialParams={{
          scroll: true,
        }}
        options={{
          headerBackTitle: 'Back',
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitle,
        }}
      />
      <Stack.Screen
        name="UpdateFirmwareProgressScreen"
        component={UpdateFirmwareProgressScreen}
        initialParams={{
          scroll: false,
        }}
        options={{
          headerBackVisible: false,
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitle,
        }}
      />
    </Stack.Navigator>
  );
};

export default NavMain;
