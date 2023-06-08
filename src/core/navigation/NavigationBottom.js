import React from 'react';
import {
  View,
  ImageBackground,
  Platform,
  SafeAreaView,
  useColorScheme,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useStore} from 'effector-react';

import {$langSettingsStore} from '@store/lang';

import InstantBrewScreen from '@screens/instant-brew';
import TeaAlarmScreen from '@screens/tea-alarm';
import PresetsScreen from '@screens/presets';
import HelpScreen from '@screens/help';
import SettingsScreen from '@screens/settings';

import {colors, fonts, tabBarStyle, headerNavigationStyle} from '@styleConst';
import Logo from '@comp/Logo';

import TabBarIcon from '@nav/components/TabBarIcon';

const iconSize = 32;
const headerLogoSize = 50;

const Tab = createBottomTabNavigator();

const NavigationBottom = props => {
  const currLang = useStore($langSettingsStore);
  const phoneTheme = useColorScheme();
  return (
    <Tab.Navigator
      {...props}
      screenOptions={{
        tabBarStyle: [tabBarStyle.default, tabBarStyle[phoneTheme]],
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.white,
        tabBarActiveBackgroundColor: '#FFFFFF1A',
        tabBarItemStyle: {
          borderRadius: 10,
        },
        tabBarBackground: () => (
          <View
            colors={colors.gradient.backgroundTabbar}
            style={{flex: 1, borderRadius: 10}}>
            <ImageBackground
              source={require('../../../assets/backgroundTile.png')}
              resizeMode="repeat"
              style={{flex: 1}}
            />
          </View>
        ),
      }}>
      <Tab.Screen
        name="Home"
        component={InstantBrewScreen}
        initialParams={{
          scroll: true,
        }}
        options={{
          header: () => {
            return (
              <SafeAreaView
                style={[
                  headerNavigationStyle.viewWrapper.default,
                  headerNavigationStyle.viewWrapper[Platform.OS],
                ]}>
                <Logo
                  width={headerLogoSize}
                  height={headerLogoSize}
                  style={headerNavigationStyle.logo[Platform.OS]}
                />
              </SafeAreaView>
            );
          },
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
        component={TeaAlarmScreen}
        initialParams={{
          scroll: true,
        }}
        options={{
          header: () => {
            return (
              <SafeAreaView
                style={[
                  headerNavigationStyle.viewWrapper.default,
                  headerNavigationStyle.viewWrapper[Platform.OS],
                ]}>
                <Logo
                  width={headerLogoSize}
                  height={headerLogoSize}
                  style={headerNavigationStyle.logo[Platform.OS]}
                />
              </SafeAreaView>
            );
          },
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
          header: () => {
            return (
              <SafeAreaView
                style={[
                  headerNavigationStyle.viewWrapper.default,
                  headerNavigationStyle.viewWrapper[Platform.OS],
                ]}>
                <Logo
                  width={headerLogoSize}
                  height={headerLogoSize}
                  style={headerNavigationStyle.logo[Platform.OS]}
                />
              </SafeAreaView>
            );
          },
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
          header: () => {
            return (
              <SafeAreaView
                style={[
                  headerNavigationStyle.viewWrapper.default,
                  headerNavigationStyle.viewWrapper[Platform.OS],
                ]}>
                <Logo
                  width={headerLogoSize}
                  height={headerLogoSize}
                  style={headerNavigationStyle.logo[Platform.OS]}
                />
              </SafeAreaView>
            );
          },
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
        initialParams={{
          scroll: true,
        }}
        options={{
          header: () => {
            return (
              <SafeAreaView
                style={[
                  headerNavigationStyle.viewWrapper.default,
                  headerNavigationStyle.viewWrapper[Platform.OS],
                ]}>
                <Logo
                  width={headerLogoSize}
                  height={headerLogoSize}
                  style={headerNavigationStyle.logo[Platform.OS]}
                />
              </SafeAreaView>
            );
          },
          tabBarIcon: ({focused}) => (
            <TabBarIcon
              iconName="settings"
              focused={focused}
              iconSize={iconSize}
              title="MenuBottom.Settings"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default NavigationBottom;
