import React from 'react';
import {Path, Svg} from 'react-native-svg';

const ArrowIcon = ({...props}) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path d="M17 14.5l-5-5-5 5h10z" fill="#71883A" />
    </Svg>
  );
};

export default ArrowIcon;
