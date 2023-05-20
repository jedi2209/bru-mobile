const colors = {
  green: {
    light: '#8CA474',
    mid: '#71883A',
    main: '#28502E',
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
    background: ['#8f8f8f', '#7e7e7e', '#6f6f6f', '#6e6e6e', '#2f2f2f'],
    backgroundTabbar: ['#242424', '#222222'],
  },
};

const fonts = {
  defaultFamily: 'Porter Light',
  defaultMenuFamily: 'Sarabun-Light',
};

const tabBarStyle = {
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
};

export {colors, fonts, tabBarStyle};
