import React from 'react';
import {Path, Svg} from 'react-native-svg';

const TrashIconOutlined = props => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path
        d="M15 2H9c-1.103 0-2 .897-2 2v1H3v2h2v13c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V7h2V5h-4V4c0-1.103-.897-2-2-2zM9 4h6v1H9V4zm8 16H7V7h10v13z"
        fill="#71883A"
        {...props}
      />
    </Svg>
  );
};

export default TrashIconOutlined;
