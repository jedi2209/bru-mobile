import React from 'react';
import {
  View,
  ImageBackground,
  Platform,
  SafeAreaView,
  useColorScheme,
  Linking,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {useStore} from 'effector-react';
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
} from '@gluestack-ui/themed';

import {$langSettingsStore, setLanguage} from '@store/lang';
import {LANGUAGE, INITIAL_SCREEN} from '@const';

import InstantBrewScreen from '@screens/instant-brew';
import TeaAlarmScreen from '@screens/tea-alarm';
import PresetsScreen from '@screens/presets';
import HelpScreen from '@screens/help';
import SettingsScreen from '@screens/settings';
import AddNewDeviceScreen from '@screens/settings/addNewDevice';

import {colors, fonts, tabBarStyle, headerNavigationStyle} from '@styleConst';
import Logo from '@comp/Logo';

import TabBarIcon from '@nav/components/TabBarIcon';

const iconSize = 32;
const headerLogoSize = 50;

const Tab = createBottomTabNavigator();
const StackSettings = createStackNavigator();

export const headerTitle = () => (
  <Logo
    width={headerLogoSize}
    height={headerLogoSize}
    style={headerNavigationStyle.logo[Platform.OS]}
  />
);

const headerBackground = () => (
  <SafeAreaView
    style={[
      headerNavigationStyle.viewWrapper.default,
      headerNavigationStyle.viewWrapper[Platform.OS],
    ]}
  />
);

const tabBarBackground = () => (
  <View
    colors={colors.gradient.backgroundTabbar}
    style={{flex: 1, borderRadius: 10}}>
    <ImageBackground
      source={require('@assets/backgroundTile.png')}
      resizeMode="repeat"
      style={{flex: 1}}
    />
  </View>
);

const SettingsStackView = ({navigation, route}) => {
  const currLang = useStore($langSettingsStore);
  return (
    <StackSettings.Navigator initialRouteName="SettingsScreen">
      <StackSettings.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        initialParams={{
          scroll: false,
        }}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitle,
          // headerRight: () => (
          //   <Select
          //     selectedValue={currLang}
          //     isDisabled={false}
          //     isInvalid={false}
          //     w={'70%'}
          //     onValueChange={res => setLanguage(res)}>
          //     <SelectTrigger>
          //       <SelectInput placeholder={currLang} />
          //     </SelectTrigger>
          //     <SelectPortal>
          //       <SelectBackdrop />
          //       <SelectContent>
          //         <SelectDragIndicatorWrapper>
          //           <SelectDragIndicator />
          //         </SelectDragIndicatorWrapper>
          //         <SelectItem label="EN" value="en" />
          //         <SelectItem label="DE" value="de" />
          //       </SelectContent>
          //     </SelectPortal>
          //   </Select>
          // ),
        }}
      />
      {/* <StackSettings.Screen
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
      /> */}
    </StackSettings.Navigator>
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
        tabBarBackground,
      }}>
      {/* <Tab.Screen
        name="Home"
        component={InstantBrewScreen}
        initialParams={{
          scroll: true,
        }}
        options={{
          headerTitle,
          tabBarIcon: ({focused}) => (
            <TabBarIcon
              iconName="instantBrew"
              iconSize={iconSize}
              focused={focused}
              title="MenuBottom.InstantBrew"
            />
          ),
          tabBarItemStyle: {
            borderRadius: 0,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          },
        }}
      /> */}
      {/* <Tab.Screen
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
      /> */}
      <Tab.Screen
        name="Help"
        component={HelpScreen}
        listeners={{
          tabPress: e => {
            e.preventDefault();
            Linking.openURL(LANGUAGE[currLang].urls.help);
          },
        }}
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
          tabBarItemStyle: {
            borderRadius: 0,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          },
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStackView}
        options={{
          headerShown: false,
          headerBackground,
          tabBarIcon: ({focused}) => (
            <TabBarIcon
              iconName="settings"
              iconSize={iconSize}
              focused={focused}
              title="MenuBottom.Settings"
            />
          ),
          tabBarItemStyle: {
            borderRadius: 0,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
          },
          // header: () => {
          //   return (
          //     <SafeAreaView
          //       style={[
          //         headerNavigationStyle.viewWrapper.default,
          //         headerNavigationStyle.viewWrapper[Platform.OS],
          //       ]}>
          //       <Logo
          //         width={headerLogoSize}
          //         height={headerLogoSize}
          //         style={headerNavigationStyle.logo[Platform.OS]}
          //       />
          //     </SafeAreaView>
          //   );
          // },
          // tabBarIcon: ({focused}) => (
          //   <TabBarIcon
          //     iconName="settings"
          //     focused={focused}
          //     iconSize={iconSize}
          //     title="MenuBottom.Settings"
          //   />
          // ),
          // tabBarItemStyle: {
          //   borderRadius: 0,
          //   borderTopRightRadius: 10,
          //   borderBottomRightRadius: 10,
          // },
        }}
      />
    </Tab.Navigator>
  );
};
