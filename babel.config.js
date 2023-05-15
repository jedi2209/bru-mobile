module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'effector/babel-plugin',
      {
        addLoc: true,
      },
    ],
  ],
};
