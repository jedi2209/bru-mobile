import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function ArrowRightIcon(props) {
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
        d="M7 6.003c0 .215-.084.43-.252.594l-5.283 5.16a.874.874 0 01-1.217 0 .826.826 0 010-1.189l4.675-4.565L.248 1.437a.827.827 0 010-1.188.875.875 0 011.217 0l5.284 5.16A.828.828 0 017 6.003z"
        fill="#474747"
      />
    </Svg>
  );
}

export default ArrowRightIcon;
