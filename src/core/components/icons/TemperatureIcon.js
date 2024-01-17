import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function TemperatureIcon({color, ...props}) {
  const selectedColor = () => {
    switch (color) {
      case 'yellow':
        return '#D2B936';
      case 'green':
        return '#71883A';
      default:
        return '#71883A';
    }
  };

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path
        d="M14.906 14.523V3.516A3.52 3.52 0 0011.391 0a3.52 3.52 0 00-3.516 3.516v11.007A5.343 5.343 0 006 18.608 5.397 5.397 0 0011.39 24a5.397 5.397 0 005.391-5.39c0-1.591-.679-3.062-1.875-4.087zm-3.515 8.07a3.989 3.989 0 01-3.985-3.984c0-1.265.581-2.427 1.594-3.188a.703.703 0 00.281-.562V3.516c0-1.163.946-2.11 2.11-2.11 1.163 0 2.109.947 2.109 2.11v11.343c0 .221.104.43.28.562a3.955 3.955 0 011.595 3.188 3.989 3.989 0 01-3.984 3.985z"
        fill="#E6E7E8"
      />
      <Path
        d="M12.094 16.13V3.515a.703.703 0 00-1.406 0V16.13a2.582 2.582 0 00-1.876 2.48 2.581 2.581 0 002.579 2.578 2.581 2.581 0 002.578-2.579 2.582 2.582 0 00-1.875-2.48zm-.703 3.651a1.173 1.173 0 01-1.172-1.172 1.173 1.173 0 012.344 0c0 .646-.526 1.172-1.172 1.172z"
        fill={selectedColor()}
      />
    </Svg>
  );
}

export default TemperatureIcon;
