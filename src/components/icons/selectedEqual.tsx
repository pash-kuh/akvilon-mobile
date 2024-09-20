import React from 'react';
import Svg, {Path} from 'react-native-svg';

export default function SelectedEqualSvg() {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 20H4V18H12V20ZM4 14H20V12H4V14ZM18 18V16H16V18H14V20H16V22H18V20H20V18H18ZM4 8H20V6H4V8Z"
        fill="#EC0932"
      />
    </Svg>
  );
}
