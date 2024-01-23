import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function CircleCheck(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 0C7.168 0 0 7.168 0 16s7.168 16 16 16 16-7.168 16-16S24.832 0 16 0zm0 28.8C8.944 28.8 3.2 23.056 3.2 16 3.2 8.944 8.944 3.2 16 3.2c7.056 0 12.8 5.744 12.8 12.8 0 7.056-5.744 12.8-12.8 12.8zm-3.2-9.328L23.344 8.928 25.6 11.2 12.8 24l-6.4-6.4 2.256-2.256 4.144 4.128z"
        fill="#71883A"
      />
    </Svg>
  );
}

export default CircleCheck;
