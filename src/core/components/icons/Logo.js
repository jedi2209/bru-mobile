import React from 'react';
import {Image} from 'react-native';

const Logo = ({width, height}) => {
  return (
    <Image
      style={{width: width || 80, height: height || 80, zIndex: 100}}
      source={require('../../../../assets/logo/BRU_logo.png')}
    />
  );
};

export default Logo;
