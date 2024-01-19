/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {useColorScheme} from 'react-native';
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

import {colors, fonts, tabBarStyle} from '../const/style';

import TabBarIcon from '@nav/components/TabBarIcon';

import NewTeaAlarmScreen from '../../screens/new-tea-alarm';
import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import ProfileScreen from '../../screens/profile';

const iconSize = 24;

const Tab = createBottomTabNavigator();
const StackSettings = createStackNavigator();
const StackTeaAlarm = createStackNavigator();
const StackPressets = createStackNavigator();

// const SettingsStackView = (props, {navigation, route}) => {
//   const currLang = useStore($langSettingsStore);
//   return (
//     <StackSettings.Navigator initialRouteName="SettingsScreen">
//       <StackSettings.Screen
//         name="SettingsScreen"
//         component={SettingsScreen}
//         initialParams={{
//           scroll: true,
//         }}
//         options={{
//           headerShown: true,
//           header: Header,
//         }}
//       />
//     </StackSettings.Navigator>
//   );
// };

const TeaAlarmStackView = ({navigation, route}) => {
  return (
    <StackTeaAlarm.Navigator initialRouteName="TeaAlarmScreen">
      <StackTeaAlarm.Screen
        name="TeaAlarm"
        component={TeaAlarmScreen}
        initialParams={{
          scroll: false,
        }}
        options={{
          headerShown: true,
          header: Header,
        }}
      />
      <StackTeaAlarm.Screen
        name="NewTeaAlarm"
        component={NewTeaAlarmScreen}
        initialParams={{
          scroll: false,
        }}
        options={{
          headerShown: true,
          header: Header,
        }}
      />
    </StackTeaAlarm.Navigator>
  );
};

const PressetsStackView = ({navigation, route}) => {
  return (
    <StackPressets.Navigator initialRouteName="Presets">
      <StackPressets.Screen
        name="Presets"
        component={PresetsScreen}
        initialParams={{
          scroll: false,
        }}
        options={{
          headerShown: true,
          header: Header,
        }}
      />
    </StackPressets.Navigator>
  );
};

export const NavigationBottom = props => {
  const currLang = useStore($langSettingsStore);
  const phoneTheme = useColorScheme();
  return (
    <Tab.Navigator
      {...props}
      initialRouteName={INITIAL_SCREEN}
      screenOptions={{
        tabBarStyle: [tabBarStyle.default, tabBarStyle[phoneTheme]],
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.gray.inactive,
        tabBarActiveBackgroundColor: colors.green.tabbar,
        header: Header,
      }}>
      <Tab.Screen
        name="Instant Brew"
        component={InstantBrewScreen}
        initialParams={{
          scroll: false,
        }}
        options={{
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
        name="Tea Alarm"
        component={TeaAlarmStackView}
        initialParams={{
          scroll: true,
        }}
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
        name="PresetsStackView"
        component={PressetsStackView}
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
        // listeners={{
        //   tabPress: e => {
        //     e.preventDefault();
        //     Linking.openURL(LANGUAGE[currLang].urls.help);
        //   },
        // }}
        initialParams={{
          scroll: true,
        }}
        options={{
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
          headerShown: true,
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
        initialParams={{scroll: false}}
        options={{
          tabBarItemStyle: {
            display: 'none',
          },
        }}
      />
    </Tab.Navigator>
  );
};
