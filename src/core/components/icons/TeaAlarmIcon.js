import React from 'react';
import {Circle, Path, Svg} from 'react-native-svg';

const TeaAlarmIcon = ({color, ...props}) => {
  const selectedColor = () => {
    switch (color) {
      case 'yellow':
        return '#D2B936';
      case 'green':
        return '#71883A';
      default:
        return '#71883A';
    }
  };

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Circle
        cx={12.5}
        cy={13.5}
        r={8.5}
        stroke="#E6E7E8"
        strokeWidth={1.5}
        {...props}
      />
      <Path
        d="M15 16l-2.5-2.5V8"
        stroke={selectedColor()}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default TeaAlarmIcon;
