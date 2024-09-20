import React from 'react';
import {View} from 'react-native';
import Svg, {Path} from 'react-native-svg';

export default function UnselectedEqualSvg() {
  return (
    <View style={{paddingVertical: 6, paddingHorizontal: 4}}>
      <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <Path
          d="M8 14H0V12H8V14ZM0 8H16V6H0V8ZM14 12V10H12V12H10V14H12V16H14V14H16V12H14ZM0 2H16V0H0V2Z"
          fill="#66727B"
        />
      </Svg>
    </View>
  );
}
