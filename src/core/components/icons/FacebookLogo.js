import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function FacebookLogo(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.007 0H.993A.993.993 0 000 .993v16.014c0 .548.445.993.993.993h8.621v-6.97H7.27V8.313h2.345V6.31c0-2.325 1.42-3.591 3.494-3.591.994 0 1.848.074 2.096.107v2.43h-1.438c-1.128 0-1.346.536-1.346 1.322v1.735h2.69l-.35 2.716h-2.34V18h4.587a.993.993 0 00.993-.993V.993A.993.993 0 0017.007 0z"
        fill="#fff"
      />
    </Svg>
  );
}

export default FacebookLogo;
