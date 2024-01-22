import * as React from 'react';
import Svg, {G, Circle, Mask, Path, Defs} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function CheckedIcon(props) {
  return (
    <Svg
      width={22}
      height={24}
      viewBox="0 0 22 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G filter="url(#filter0_d_260_18278)">
        <Circle cx={11} cy={11} r={11} fill="#000" />
      </G>
      <Mask
        id="a"
        style={{
          maskType: 'luminance',
        }}
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={22}
        height={22}>
        <Circle cx={11} cy={11} r={11} fill="#fff" />
      </Mask>
      <G mask="url(#a)">
        <Path fill="#71883A" d="M-12 -12H34V32H-12z" />
        <Path d="M4.5 11.5L8 15l8-8" stroke="#fff" />
      </G>
      <Defs></Defs>
    </Svg>
  );
}

export default CheckedIcon;
