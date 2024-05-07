import {DefaultTheme, DarkTheme} from '@react-navigation/native';

const colors = {
  green: {
    light: '#8CA474',
    mid: '#71883A',
    main: '#28502E',
    tabbar: '#4e5736',
    header: '#677E30',
  },
  blue: '#1B2F33',
  black: '#202020',
  brown: '#353535',
  white: '#F5F5F5',
  gray: {
    light: '#A9A9C3',
    inactive: '#B0B0B0',
    dark: '#E5E5E5',
    grayDarkText: '#474747',
    grayLightText: '#CDCACA',
    lightGray: '#DADADA',
  },
  red: '#AF1F23',
  gradient: {
    background: {
      dark: ['#5e5e5e', '#4e4e4e', '#4f4f4f', '#3e3e3e'],
      light: ['#EFEFEF', '#EFEFEF'],
    },
    backgroundTabbar: ['#242424', '#222222'],
    pressetItem: {
      dark: ['white', 'white', 'white'],
      light: ['#EBEBEB', '#E6E7E8', '#F2F2F2'],
    },
    pressetInfo: {
      light: ['#f5f5f5', '#f2f2f2', '#f9fafb'],
      dark: ['white', 'white', 'white'],
    },
    helpCollapsibleDark: ['#404040', '#2b2b2b'],
    profileInfo: {
      light: [
        'rgba(245, 245, 245, 0.70)',
        'rgba(242, 242, 242, 0.70)',
        'rgba(249, 250, 251, 0.70)',
      ],
      dark: ['rgba(64, 64, 64, 0.70)', 'rgba(43, 43, 43, 0.70)'],
    },
  },
};

const themeProfile = {
  dark: {
    Text: {
      color: colors.white,
    },
  },
  light: {
    Text: {
      color: colors.black,
    },
  },
};

const fonts = {
  defaultFamily: 'Porter Light',
  defaultMenuFamily: 'Sarabun-Light',
};

const tabBarStyle = {
  default: {
    backgroundColor: colors.black,
    paddingBottom: 0,
    height: 65,
    borderTopWidth: 0,
    position: 'absolute',
    shadowColor: colors.brown,
    shadowOffset: {
      width: 5,
      height: -5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  dark: {},
  light: {},
};

const headerNavigationStyle = {
  viewWrapper: {
    default: {
      backgroundColor: colors.green.mid,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ios: {
      height: 100,
    },
    android: {
      height: 60,
    },
  },
  logo: {
    ios: {
      marginTop: -10,
    },
    android: {
      marginTop: 0,
    },
  },
};

const navigationTheme = {
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: colors.green.main,
      card: colors.green.mid,
      border: colors.green.light,
      text: colors.gray.dark,
    },
  },
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.green.main,
      card: colors.green.mid,
      border: colors.green.light,
      text: colors.black,
    },
  },
};

const basicStyles = {
  rowBetween: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  screenTitle: {
    color: colors.gray.grayDarkText,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.4,
    marginBottom: 20,
  },
  textButton: {
    color: colors.green.mid,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 22,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  backgroundButton: {
    backgroundColor: colors.green.mid,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 90,
  },
  backgroundButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 22,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  darkText: {color: colors.gray.grayLightText},
  darkTextProfile: {color: colors.gray.lightGray},
};

export {
  colors,
  themeProfile,
  fonts,
  tabBarStyle,
  headerNavigationStyle,
  navigationTheme,
  basicStyles,
};
