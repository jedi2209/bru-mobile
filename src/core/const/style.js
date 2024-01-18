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
  gradient: {
    background: {
      dark: ['#5e5e5e', '#4e4e4e', '#4f4f4f', '#3e3e3e'],
      light: ['#EFEFEF', '#EFEFEF'],
    },
    backgroundTabbar: ['#242424', '#222222'],
    pressetItem: {
      dark: ['#404040', '#E6E7E8', '#CDCACA'],
      light: ['#EBEBEB', '#E6E7E8', '#F2F2F2'],
    },
    pressetInfo: {
      light: ['#f5f5f5', '#f2f2f2', '#f9fafb'],
      dark: ['#404040', '#E6E7E8', '#CDCACA'],
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
    // bottom: 0,
    paddingHorizontal: 19,
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
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
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
