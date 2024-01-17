import React from 'react-native';
import {G, Path, Svg} from 'react-native-svg';

const CartIcon = (style, ...props) => {
  return (
    <Svg
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      width={28}
      height={28}
      viewBox="0 0 28 28"
      fill="none"
      {...props}>
      <G
        stroke="#231F20"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round">
        <Path d="M10.77 24.77a1.077 1.077 0 100-2.155 1.077 1.077 0 000 2.154zM22.615 24.77a1.077 1.077 0 100-2.155 1.077 1.077 0 000 2.154zM2.154 2.154h4.308l2.886 14.42a2.154 2.154 0 002.153 1.734H21.97a2.154 2.154 0 002.154-1.734l1.723-9.036H7.538" />
      </G>
    </Svg>
  );
};

export default CartIcon;
