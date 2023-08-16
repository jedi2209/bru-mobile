import {DefaultTheme, DarkTheme} from '@react-navigation/native';

const colors = {
  green: {
    light: '#8CA474',
    mid: '#71883A',
    main: '#28502E',
    tabbar: '#4e5736',
  },
  blue: '#1B2F33',
  black: '#202020',
  brown: '#353535',
  white: '#F5F5F5',
  gray: {
    light: '#A9A9C3',
    inactive: '#B0B0B0',
    dark: '#E5E5E5',
  },
  gradient: {
    background: {
      dark: ['#5e5e5e', '#4e4e4e', '#4f4f4f', '#3e3e3e'],
      light: ['#F5F5F5', '#afafaf'],
    },
    backgroundTabbar: ['#242424', '#222222'],
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
    paddingHorizontal: 0,
    // borderTopRightRadius: 10,
    // borderTopLeftRadius: 10,
    height: 80,
    borderTopWidth: 0,
    marginHorizontal: 10,
    bottom: 20,
    borderRadius: 10,
    position: 'absolute',
    shadowColor: colors.brown,
    shadowOffset: {
      width: 0,
      height: -10,
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

export {
  colors,
  themeProfile,
  fonts,
  tabBarStyle,
  headerNavigationStyle,
  navigationTheme,
};
