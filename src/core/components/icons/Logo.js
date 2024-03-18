import React from 'react';
import {Image} from 'react-native';

const Logo = () => {
  return (
    <Image
      style={{width: 80, height: 80, zIndex: 100}}
      source={require('../../../../assets/logo/BRU_logo.png')}
    />
  );
};

export default Logo;
