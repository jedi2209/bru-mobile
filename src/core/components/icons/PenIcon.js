import React from 'react';
import {Path, Svg} from 'react-native-svg';

const PenIcon = props => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <Path
        d="M11.177 4.563l-8.18 8.18-.178 1.948c-.04.45.336.826.786.785l1.948-.177 8.18-8.18-2.556-2.556zM14.244 6.608l1.534-1.534a.723.723 0 000-1.023l-1.534-1.533a.723.723 0 00-1.022 0L11.688 4.05l2.556 2.557z"
        fill="#71883A"
        {...props}
      />
    </Svg>
  );
};

export default PenIcon;
