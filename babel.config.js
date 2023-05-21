const path = require('path');
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'effector/babel-plugin',
      {
        addLoc: true,
      },
    ],
    [
      'react-native-reanimated/plugin',
      {
        relativeSourceLocation: true,
      },
    ],
    [
      'babel-plugin-module-resolver',
      {
        root: [path.resolve('./')],
        alias: {
          '@core': './src/core',
          '@nav': './src/core/navigation',
          '@comp': './src/core/components',
          '@lang': './src/core/lang',
          '@gluestack': './src/gluestack',
          '@const': './src/core/const',
          '@screens': './src/screens',
          '@utils': './src/utils',
        },
      },
    ],
  ],
};
