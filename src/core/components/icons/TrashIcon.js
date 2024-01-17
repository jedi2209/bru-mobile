import React from 'react';
import {Path, Svg} from 'react-native-svg';

const TrashIcon = props => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <Path
        d="M11.25 1.5h-4.5c-.827 0-1.5.673-1.5 1.5v.75h-3v1.5h1.5V15c0 .827.673 1.5 1.5 1.5h7.5c.827 0 1.5-.673 1.5-1.5V5.25h1.5v-1.5h-3V3c0-.827-.673-1.5-1.5-1.5zM6.75 3h4.5v.75h-4.5V3z"
        fill="#71883A"
      />
    </Svg>
  );
};

export default TrashIcon;
