import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function WaterIcon({color, ...props}) {
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
        d="M11.876 4.778a.649.649 0 00-.968 0c-.248.266-6.12 6.546-6.12 10.765 0 4.353 2.962 7.898 6.606 7.898 3.64 0 6.606-3.545 6.606-7.898 0-4.22-5.873-10.5-6.124-10.765zm-.482 17.091c-2.866 0-5.198-2.84-5.198-6.326 0-2.678 3.396-7.059 5.198-9.093 1.801 2.034 5.197 6.415 5.197 9.093 0 3.486-2.332 6.326-5.197 6.326z"
        fill="#E6E7E8"
      />
      <Path
        d="M8.714 15.377c.007-.432-.296-.79-.685-.801H8.01c-.378 0-.692.339-.702.766-.004.089-.048 2.227 1.464 4 .337.396.857.177.995.034a.857.857 0 00.031-1.113c-1.088-1.29-1.085-2.851-1.085-2.886z"
        fill={selectedColor()}
      />
    </Svg>
  );
}

export default WaterIcon;
