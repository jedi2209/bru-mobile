/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {useStore} from 'effector-react';

import {$langSettingsStore, setLanguage} from '@store/lang';
import {LANGUAGE, INITIAL_SCREEN} from '@const';

import InstantBrewScreen from '@screens/instant-brew';
import TeaAlarmScreen from '@screens/tea-alarm';
import PresetsScreen from '@screens/presets';
import HelpScreen from '@screens/help';
import SettingsScreen from '@screens/settings';

import {colors, tabBarStyle} from '../const/style';

import TabBarIcon from '@nav/components/TabBarIcon';

import NewTeaAlarmScreen from '../../screens/new-tea-alarm';
import ProfileScreen from '../../screens/profile';
import BrewingScreen from '../../screens/brewing';
import {$themeStore} from '../store/theme';

const iconSize = 24;

const Tab = createBottomTabNavigator();

// const PressetsStackView = ({navigation, route}) => {
//   return (
//     <StackPressets.Navigator
//       screenOptions={{headerShown: false}}
//       initialRouteName="Presets">
//       <StackPressets.Screen
//         name="Presets"
//         component={PresetsScreen}
//         initialParams={{
//           scroll: true,
//         }}
//       />
//     </StackPressets.Navigator>
//   );
// };

export const NavigationBottom = props => {
  // const currLang = useStore($langSettingsStore);
  const theme = useStore($themeStore);
  return (
    <Tab.Navigator
      {...props}
      initialRouteName={INITIAL_SCREEN}
      screenOptions={{
        tabBarStyle: [tabBarStyle.default, tabBarStyle[theme]],
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.gray.inactive,
        tabBarActiveBackgroundColor: colors.green.tabbar,
      }}>
      <Tab.Screen
        name="Instant Brew"
        component={InstantBrewScreen}
        initialParams={{
          scroll: true,
        }}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabBarIcon
              iconName="instantBrew"
              iconSize={iconSize}
              focused={focused}
              title="MenuBottom.InstantBrew"
            />
          ),
        }}
      />
      <Tab.Screen
        name="TeaAlarm"
        component={TeaAlarmScreen}
        initialParams={{scroll: true}}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabBarIcon
              iconName="teaAlarm"
              iconSize={iconSize}
              focused={focused}
              title="MenuBottom.TeaAlarm"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Presets"
        component={PresetsScreen}
        initialParams={{
          scroll: true,
        }}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabBarIcon
              iconName="presets"
              iconSize={iconSize}
              focused={focused}
              title="MenuBottom.Presets"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Help"
        component={HelpScreen}
        initialParams={{
          scroll: true,
        }}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabBarIcon
              iconName="help"
              focused={focused}
              iconSize={iconSize}
              title="MenuBottom.Help"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        initialParams={{scroll: true}}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabBarIcon
              iconName="settings"
              iconSize={iconSize}
              focused={focused}
              title="MenuBottom.Settings"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{scroll: true}}
        options={{
          headerShown: false,
          tabBarItemStyle: {
            display: 'none',
          },
        }}
      />
      <Tab.Screen
        name="NewTeaAlarm"
        component={NewTeaAlarmScreen}
        initialParams={{scroll: true}}
        options={{
          headerShown: false,
          tabBarItemStyle: {
            display: 'none',
          },
        }}
      />
      <Tab.Screen
        name="Brewing"
        component={BrewingScreen}
        initialParams={{scroll: true}}
        options={{
          headerShown: false,
          tabBarItemStyle: {
            display: 'none',
          },
        }}
      />
    </Tab.Navigator>
  );
};
