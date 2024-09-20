import React from 'react';
import Svg, {Path, Defs, G} from 'react-native-svg';

export default function AkvilonCardSvg() {
  return (
    <Svg fill="none">
      <G filter="url(#a)">
        <Path
          fill="#B5B5B5"
          d="m20.73 4.55 1.6 6a1.42 1.42 0 0 1-1 1.74l-10.79 2.84a1.41 1.41 0 0 1-1.39-.39.999.999 0 0 1-.25-.36 2.594 2.594 0 0 1-.1-.25l-1.59-6a1.4 1.4 0 0 1 1-1.74L19 3.55a1.4 1.4 0 0 1 1.61.68c.054.101.094.209.12.32Z"
        />
        <Path
          fill="#F13B3B"
          d="m21.2 6.31 1.13 4.19a1.42 1.42 0 0 1-1 1.74L14.89 14l4.07-7 2.24-.69Z"
        />
        <Path
          fill="#5E5E5E"
          d="M14.46 4.76 8.9 14.38a2.605 2.605 0 0 1-.1-.25l-1.59-6a1.4 1.4 0 0 1 1-1.74l6.25-1.63Z"
        />
      </G>
      <Defs></Defs>
    </Svg>
  );
}
