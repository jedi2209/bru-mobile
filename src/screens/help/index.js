import {Dimensions} from 'react-native';
import {WebView} from 'react-native-webview';

import Wrapper from '@comp/Wrapper';

import {colors} from '@styleConst';

const height = Dimensions.get('screen').height - 60;

const HelpScreen = props => {
  return (
    <WebView
      originWhitelist={['*']}
      source={{uri: 'https://bru.shop/en-eu/pages/help'}}
      style={{flex: 1, maxHeight: height, height: height, paddingBottom: 60}}
    />
  );
};

export default HelpScreen;
