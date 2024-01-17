import React from 'react';
import {Path, Svg} from 'react-native-svg';

const PlusIcon = props => {
  return (
    <Svg viewBox="0 -0.5 21 21" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path
        transform="translate(-379 -240) translate(56 160)"
        fill="#71883A"
        stroke="none"
        strokeWidth={1}
        fillRule="evenodd"
        d="M344 89L344 91 334.55 91 334.55 100 332.45 100 332.45 91 323 91 323 89 332.45 89 332.45 80 334.55 80 334.55 89z"
      />
    </Svg>
  );
};

export default PlusIcon;
