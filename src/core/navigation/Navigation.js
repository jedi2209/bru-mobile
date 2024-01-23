import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  NavigationBottom as NavBottom,
  headerTitle,
} from '@nav/NavigationBottom';
import AddNewDeviceScreen from '@screens/settings/addNewDevice';
import UpdateFirmwareScreen from '@screens/settings/updateFirmware';
import UpdateFirmwareProgressScreen from '@screens/settings/updateFirmwareProgress';
import {default as CustomHeader} from '../components/Header';
import UpdateScreen from '../../screens/downloadingUpdate';

const Stack = createNativeStackNavigator();
const NavMain = props => {
  return (
    <Stack.Navigator screenOptions={{header: CustomHeader}} {...props}>
      <Stack.Screen
        name="NavBottom"
        options={{headerShown: true}}
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
          headerShown: true,
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
      <Stack.Screen
        name="DownloadingUpdate"
        component={UpdateScreen}
        initialParams={{
          scroll: false,
        }}
        options={{
          headerBackVisible: false,
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default NavMain;
