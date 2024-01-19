import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const ArrowLeftIcon = props => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={7}
      height={12}
      viewBox="0 0 7 12"
      fill="none"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 5.997c0-.215.084-.43.252-.594L5.536.243a.874.874 0 011.216 0 .827.827 0 010 1.189L2.077 5.997l4.675 4.566a.827.827 0 010 1.188.875.875 0 01-1.217 0L.252 6.591A.828.828 0 010 5.997z"
        fill="#474747"
      />
    </Svg>
  );
};

export default ArrowLeftIcon;
