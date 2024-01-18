import React from 'react';
import {Path, Svg} from 'react-native-svg';

const DownArrowIcon = props => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      {...props}>
      <Path d="M2 5l6 6 6-6H2z" fill="#fff" {...props} />
    </Svg>
  );
};

export default DownArrowIcon;
