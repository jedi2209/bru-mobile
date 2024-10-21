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
      'babel-plugin-module-resolver',
      {
        root: [path.resolve('./')],
        alias: {
          '@assets': './assets',
          '@comp': './src/core/components',
          '@const': './src/core/const',
          '@core': './src/core',
          '@gluestack': './src/gluestack',
          '@lang': './src/core/lang',
          '@nav': './src/core/navigation',
          '@styleConst': './src/core/const/style',
          '@screens': './src/screens',
          '@store': './src/core/store',
          '@utils': './src/utils',
        },
      },
    ],
    [
      'react-native-reanimated/plugin',
      {
        relativeSourceLocation: true,
      },
    ],
    ['@babel/plugin-transform-private-methods', { loose: true }],
  ],
};
