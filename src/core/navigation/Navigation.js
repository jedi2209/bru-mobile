import React, {useEffect} from 'react';
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
import AuthorizationScreen from '../../screens/authorization';
import {useStore} from 'effector-react';
import {$userStore} from '../store/user';
const Stack = createNativeStackNavigator();
const NavMain = props => {
  const user = useStore($userStore);

  console.log(user, 'useruseruser');

  return (
    <Stack.Navigator screenOptions={{header: CustomHeader}} {...props}>
      {user ? (
        <>
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
              headerShown: false,
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
              headerShown: false,
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
              headerShown: false,
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
        </>
      ) : (
        <>
          <Stack.Screen
            name="Authorization"
            component={AuthorizationScreen}
            options={{
              headerBackVisible: false,
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="NavBottom"
            options={{headerShown: true}}
            component={NavBottom}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default NavMain;
