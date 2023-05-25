import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Platform,
  SafeAreaView,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SVG, {Path, Circle} from 'react-native-svg';
import {useStore} from 'effector-react';

import {$langSettingsStore} from '@store/lang';
import {translate} from '@core/lang';

import InstantBrewScreen from '@screens/instant-brew';
import TeaAlarmScreen from '@screens/tea-alarm';
import PresetsScreen from '@screens/presets';
import HelpScreen from '@screens/help';
import SettingsScreen from '@screens/settings';

import {colors, fonts, tabBarStyle, headerNavigationStyle} from '@styleConst';
import Logo from '@comp/Logo';

const styles = StyleSheet.create({
  tabBarItem: {
    alignItems: 'center',
    verticalAlign: 'top',
    borderRadius: 10,
  },
  tabBarItemIcon: {
    marginTop: 5,
    marginBottom: 7,
    height: 32,
  },
  labelText: {
    fontSize: 12,
    textTransform: 'uppercase',
    textAlign: 'center',
    fontFamily: fonts.defaultFamily,
  },
});

const iconSize = 28;
const headerLogoSize = 50;

const Tab = createBottomTabNavigator();

const NavigationBottom = props => {
  const currLang = useStore($langSettingsStore);
  return (
    <Tab.Navigator
      {...props}
      screenOptions={{
        tabBarStyle,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.white,
        tabBarActiveBackgroundColor: '#60703999',
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
            <View style={styles.tabBarItem}>
              <View style={styles.tabBarItemIcon}>
                <SVG
                  width={iconSize}
                  height={iconSize}
                  fill="none"
                  viewBox="0 0 24 24">
                  <Path
                    d="M4 22V14.1935L12 7L20 14.1935V22M10.2857 22V17.8571H13.7143V22"
                    stroke={focused ? colors.white : colors.gray.inactive}
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <Path
                    d="M17.2107 9C17.2107 7.72429 16.7366 5.98975 17.2107 4.8C18.0593 2.67035 22.4971 2 22.4971 2C22.4971 2 23.9015 6.55142 22.0165 8.06667C20.9641 8.91272 17.2107 9 17.2107 9ZM17.2107 9L20 6"
                    stroke={colors.green.mid}
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </SVG>
              </View>
              <Text
                style={[
                  styles.labelText,
                  {color: focused ? colors.white : colors.gray.inactive},
                ]}>
                {translate('MenuBottom.InstantBrew')}
              </Text>
            </View>
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
            <View style={styles.tabBarItem}>
              <View style={styles.tabBarItemIcon}>
                <SVG
                  width={iconSize}
                  height={iconSize}
                  fill="none"
                  viewBox="0 0 24 24">
                  <Circle
                    cx="12.5"
                    cy="13.5"
                    r="8.5"
                    stroke={focused ? colors.white : colors.gray.inactive}
                    stroke-width="1.5"
                  />
                  <Path
                    d="M15 16L12.5 13.5V8"
                    stroke={colors.green.mid}
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </SVG>
              </View>
              <Text
                style={[
                  styles.labelText,
                  {color: focused ? colors.white : colors.gray.inactive},
                ]}>
                {translate('MenuBottom.TeaAlarm')}
              </Text>
            </View>
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
            <View style={styles.tabBarItem}>
              <View style={styles.tabBarItemIcon}>
                <SVG
                  width={iconSize}
                  height={iconSize}
                  fill="none"
                  viewBox="0 0 24 24">
                  <Path
                    d="M20 11.5C20 11.5 20.656 10.5782 22.5 11.5C23.5 12 20.5 15.5 20 15.5C19.5 15.5 18.5 16 18.5 16"
                    stroke={focused ? colors.white : colors.gray.inactive}
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <Path
                    d="M20.75 9C20.75 8.58579 20.4142 8.25 20 8.25C19.5858 8.25 19.25 8.58579 19.25 9H20.75ZM16.0967 19L15.6062 18.4327V18.4327L16.0967 19ZM7.90326 19L8.39381 18.4327L8.39381 18.4327L7.90326 19ZM4.75 9C4.75 8.58579 4.41421 8.25 4 8.25C3.58579 8.25 3.25 8.58579 3.25 9H4.75ZM15 20.0935L14.4662 19.5666C14.3226 19.7121 14.2446 19.91 14.2503 20.1143C14.256 20.3187 14.3448 20.5118 14.4963 20.6491L15 20.0935ZM9 20.0935L9.47782 20.6716C9.63999 20.5375 9.7384 20.3415 9.74904 20.1314C9.75968 19.9213 9.68158 19.7164 9.5338 19.5666L9 20.0935ZM19.25 9C19.25 14.0385 17.4106 16.8724 15.6062 18.4327L16.5873 19.5673C18.7355 17.7099 20.75 14.455 20.75 9H19.25ZM8.39381 18.4327C6.58936 16.8724 4.75 14.0385 4.75 9H3.25C3.25 14.455 5.26455 17.7099 7.41271 19.5673L8.39381 18.4327ZM12 20.25H9V21.75H12V20.25ZM15 20.25H12V21.75H15V20.25ZM15.6062 18.4327C15.3347 18.6674 14.8613 19.1663 14.4662 19.5666L15.5338 20.6203C15.9848 20.1634 16.3756 19.7504 16.5873 19.5673L15.6062 18.4327ZM14.4963 20.6491C14.5999 20.7431 14.6625 20.8118 14.698 20.8569C14.7353 20.9041 14.7301 20.9095 14.718 20.8764C14.7042 20.839 14.6791 20.7439 14.7071 20.6171C14.736 20.4858 14.8067 20.3896 14.8713 20.331C14.9289 20.2788 14.9786 20.2583 14.9921 20.2531C15.0081 20.2469 15.0141 20.2465 15.0068 20.2479C15.001 20.2489 14.9941 20.2497 14.9888 20.25C14.9867 20.2502 14.9861 20.2502 14.9876 20.2501C14.9883 20.2501 14.9897 20.2501 14.9917 20.2501C14.9927 20.25 14.9939 20.25 14.9953 20.25C14.996 20.25 14.9967 20.25 14.9975 20.25C14.9979 20.25 14.9983 20.25 14.9987 20.25C14.9989 20.25 14.9992 20.25 14.9993 20.25C14.9997 20.25 15 20.25 15 21C15 21.75 15.0003 21.75 15.0007 21.75C15.0008 21.75 15.0011 21.75 15.0014 21.75C15.0019 21.75 15.0024 21.75 15.0029 21.75C15.0039 21.75 15.005 21.75 15.0062 21.75C15.0085 21.75 15.0111 21.7499 15.014 21.7499C15.0197 21.7498 15.0266 21.7497 15.0344 21.7494C15.05 21.7489 15.0699 21.748 15.0932 21.7464C15.1387 21.7432 15.2021 21.7369 15.2744 21.7238C15.3876 21.7033 15.6554 21.6448 15.8787 21.4423C16.0058 21.3271 16.1233 21.1601 16.1718 20.9403C16.2193 20.7249 16.1864 20.5236 16.1258 20.3587C16.0148 20.0569 15.7786 19.787 15.5037 19.5378L14.4963 20.6491ZM9 21C9 20.25 9.0003 20.25 9.00059 20.25C9.00069 20.25 9.00098 20.25 9.00117 20.25C9.00154 20.25 9.0019 20.25 9.00225 20.25C9.00294 20.25 9.00358 20.25 9.00417 20.25C9.00534 20.25 9.00629 20.25 9.00705 20.25C9.00855 20.2501 9.00928 20.2501 9.00932 20.2501C9.00934 20.2501 9.00688 20.25 9.00261 20.2497C8.99315 20.2491 8.98038 20.2479 8.96809 20.2459C8.95427 20.2436 8.95266 20.2422 8.96125 20.2452C8.96635 20.247 9.01078 20.2625 9.06655 20.3086C9.12902 20.3602 9.21181 20.4569 9.247 20.6023C9.2816 20.7453 9.2505 20.8544 9.23288 20.8981C9.21757 20.936 9.21036 20.9319 9.25258 20.8831C9.29247 20.8369 9.36243 20.7669 9.47782 20.6716L8.52218 19.5154C8.22636 19.7599 7.96606 20.0288 7.84174 20.3371C7.77271 20.5082 7.73305 20.7235 7.78907 20.9551C7.84568 21.189 7.97988 21.3565 8.1109 21.4648C8.33965 21.6538 8.60994 21.707 8.72345 21.7258C8.79684 21.7379 8.86119 21.7438 8.90743 21.7467C8.931 21.7482 8.95104 21.749 8.96658 21.7495C8.97438 21.7497 8.98114 21.7498 8.98673 21.7499C8.98952 21.7499 8.99203 21.75 8.99425 21.75C8.99536 21.75 8.99639 21.75 8.99735 21.75C8.99783 21.75 8.99829 21.75 8.99873 21.75C8.99895 21.75 8.99927 21.75 8.99938 21.75C8.99969 21.75 9 21.75 9 21ZM9.5338 19.5666C9.1387 19.1663 8.6653 18.6674 8.39381 18.4327L7.41271 19.5673C7.62441 19.7504 8.0152 20.1634 8.4662 20.6203L9.5338 19.5666Z"
                    fill={focused ? colors.white : colors.gray.inactive}
                  />
                  <Path
                    d="M10.6502 11C10.1807 8.1579 5.95471 5.78947 9.24154 2C8.72358 7.21053 12.0588 6.26316 10.6502 11Z"
                    fill={colors.green.mid}
                  />
                  <Path
                    d="M14.6502 11C14.1807 8.1579 9.95471 5.78947 13.2415 2C12.7236 7.21053 16.0588 6.26316 14.6502 11Z"
                    fill={colors.green.mid}
                  />
                </SVG>
              </View>
              <Text
                style={[
                  styles.labelText,
                  {color: focused ? colors.white : colors.gray.inactive},
                ]}>
                {translate('MenuBottom.Presets')}
              </Text>
            </View>
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
            <View style={styles.tabBarItem}>
              <View style={styles.tabBarItemIcon}>
                <SVG
                  width={iconSize}
                  height={iconSize}
                  fill="none"
                  viewBox="0 0 24 24">
                  <Circle
                    cx="12.5"
                    cy="13.5"
                    r="8.5"
                    stroke={focused ? colors.white : colors.gray.inactive}
                    stroke-width="1.5"
                  />
                  <Path
                    d="M10.5 10.5C10.5 7.49999 14.5 8.49999 14.5 10.5C14.5 12.4999 12 12.5 12.5 15"
                    stroke={colors.green.mid}
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                  <Circle
                    cx="12.75"
                    cy="17.75"
                    r="0.75"
                    fill={colors.green.mid}
                  />
                </SVG>
              </View>
              <Text
                style={[
                  styles.labelText,
                  {color: focused ? colors.white : colors.gray.inactive},
                ]}>
                {translate('MenuBottom.Help')}
              </Text>
            </View>
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
            <View style={styles.tabBarItem}>
              <View style={styles.tabBarItemIcon}>
                <SVG
                  width={iconSize}
                  height={iconSize}
                  fill="none"
                  viewBox="0 0 24 24">
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M5.10357 10.261L6.51024 7.739C6.69184 7.41342 7.06795 7.26265 7.41402 7.37671L8.83372 7.8446C9.02317 7.70041 9.21973 7.56813 9.42226 7.44809C9.6152 7.33324 9.81469 7.22885 10.02 7.13568L10.3384 5.62904C10.416 5.26178 10.7302 5 11.0934 5H13.9067C14.2699 5 14.5841 5.26178 14.6617 5.62904L14.9801 7.13568C15.198 7.23454 15.4093 7.34603 15.6132 7.46926C15.8032 7.58363 15.9879 7.70883 16.1663 7.8446L17.586 7.37671C17.9321 7.26265 18.3082 7.41342 18.4898 7.739L19.8964 10.261C20.078 10.5866 20.0161 10.9991 19.7476 11.2524L18.6463 12.2911C18.6716 12.5271 18.684 12.7634 18.6838 12.9991C18.6841 13.2354 18.6717 13.4724 18.6463 13.7089L19.7476 14.7477C20.0161 15.0009 20.078 15.4134 19.8964 15.739L18.4898 18.261C18.3082 18.5866 17.9321 18.7374 17.586 18.6233L16.1663 18.1554C15.9857 18.2928 15.7987 18.4194 15.6062 18.535C15.4045 18.6565 15.1955 18.7666 14.9801 18.8643L14.6617 20.371C14.5841 20.7382 14.2699 21 13.9067 21H11.0934C10.7302 21 10.416 20.7382 10.3384 20.371L10.02 18.8643C9.81708 18.7722 9.61984 18.6692 9.429 18.5559C9.22409 18.4348 9.02527 18.3012 8.83372 18.1554L7.41402 18.6233C7.06795 18.7374 6.69184 18.5866 6.51024 18.261L5.10357 15.739C4.92197 15.4134 4.98389 15.0009 5.25235 14.7477L6.35366 13.7089C6.32835 13.4726 6.31594 13.236 6.31616 13C6.31594 12.764 6.32835 12.5274 6.35366 12.2911L5.25235 11.2524C4.98389 10.9991 4.92197 10.5866 5.10357 10.261ZM13.2847 6.6L13.6384 8.27381L14.3595 8.60105C14.5226 8.67506 14.6809 8.75857 14.8338 8.85096L14.8363 8.85246C14.9787 8.9382 15.1171 9.032 15.2506 9.13363L15.8849 9.61647L17.4622 9.09665L18.2468 10.5034L17.0233 11.6574L17.11 12.4674C17.129 12.6441 17.1383 12.8212 17.1381 12.9978L17.1381 13.0008C17.1383 13.178 17.129 13.3555 17.1101 13.5326L17.0233 14.3427L18.2468 15.4967L17.4622 16.9034L15.8849 16.3836L15.2506 16.8664C15.1154 16.9693 14.9753 17.0641 14.831 17.1507L14.8285 17.1522C14.6773 17.2433 14.5208 17.3258 14.3595 17.3989L13.6384 17.7262L13.2847 19.4H11.7155L11.3617 17.7262L10.6406 17.3989C10.4887 17.33 10.341 17.2528 10.1979 17.1679L10.1954 17.1664C10.0417 17.0756 9.89279 16.9755 9.74941 16.8664L9.11506 16.3836L7.53783 16.9034L6.75322 15.4967L7.97673 14.3427L7.88995 13.5326C7.871 13.3557 7.8617 13.1784 7.86186 13.0015L7.86186 12.9985C7.8617 12.8216 7.871 12.6443 7.88995 12.4674L7.97673 11.6574L6.75322 10.5034L7.53783 9.09665L9.11506 9.61647L9.74941 9.13363C9.89122 9.02569 10.0385 8.92659 10.1903 8.83659L10.1928 8.83509C10.3375 8.74899 10.4869 8.6708 10.6406 8.60105L11.3617 8.27381L11.7155 6.6H13.2847Z"
                    fill={focused ? colors.white : colors.gray.inactive}
                  />
                  <Path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M15.5 13C15.5 14.6569 14.1569 16 12.5 16C10.8431 16 9.5 14.6569 9.5 13C9.5 11.3431 10.8431 10 12.5 10C14.1569 10 15.5 11.3431 15.5 13ZM14 13C14 13.8284 13.3284 14.5 12.5 14.5C11.6716 14.5 11 13.8284 11 13C11 12.1716 11.6716 11.5 12.5 11.5C13.3284 11.5 14 12.1716 14 13Z"
                    fill={colors.green.mid}
                  />
                </SVG>
              </View>
              <Text
                style={[
                  styles.labelText,
                  {color: focused ? colors.white : colors.gray.inactive},
                ]}>
                {translate('MenuBottom.Settings')}
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default NavigationBottom;
