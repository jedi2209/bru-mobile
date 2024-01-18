import React from 'react';
import {ClipPath, Defs, G, Path, Rect, Svg} from 'react-native-svg';

const PlusCircle = props => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={27}
      height={24}
      viewBox="0 0 27 24"
      fill="none"
      {...props}>
      <G filter="url(#filter0_dd_260_28555)">
        <G clipPath="url(#clip0_260_28555)">
          <Rect x={3} y={2} width={20} height={20} rx={10} fill="#fff" />
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3 12C3 6.48 7.48 2 13 2s10 4.48 10 10-4.48 10-10 10S3 17.52 3 12zm11 1h4v-2h-4V7h-2v4H8v2h4v4h2v-4z"
            fill="#71883A"
          />
        </G>
      </G>
      <Defs>
        <ClipPath id="clip0_260_28555">
          <Rect x={3} y={2} width={20} height={20} rx={10} fill="#fff" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default PlusCircle;
