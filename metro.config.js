/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const {assetExts, sourceExts} = require('metro-config/src/defaults/defaults');
const blacklist = require('metro-config/src/defaults/exclusionList');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const cfg = async () => await getDefaultConfig(__dirname);

const assetExtsToFilter = ['svg'];

module.exports = cfg().then(res => {
  return mergeConfig(res, {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      assetExts: [
        ...assetExts.filter(ext => !assetExtsToFilter.includes(ext)),
        'lottie',
      ],
      sourceExts: [...sourceExts, 'svg', 'lottie'],
      blacklistRE: blacklist([/ios\/build\/.*/]),
    },
  });
});
