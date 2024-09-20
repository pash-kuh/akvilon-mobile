import React, {Component} from 'react';
import Svg, {Path, Circle} from 'react-native-svg';
import {TouchableOpacity, ViewStyle} from 'react-native';
/**
 * Иконка крестика
 *
 * @category Icon
 */
export class CloseStoryBtn extends Component<{
  onPress?: () => void;
  style?: ViewStyle;
}> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity
        style={this.props.style}
        onPress={() => this.props.onPress()}>
        <Svg width={60} height={60} viewBox="0 0 48 48">
          <Circle cx={24} cy={24} r={12} fill="#F4F5F6" />
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20.2423 19.7577L19.5352 20.4648L23.0702 23.9999L19.5351 27.5351L20.2422 28.2422L23.7773 24.707L27.3133 28.243L28.0204 27.5359L24.4845 23.9999L28.0204 20.464L27.3133 19.7569L23.7773 23.2928L20.2423 19.7577Z"
            fill="#151719"
          />
        </Svg>
      </TouchableOpacity>
    );
  }
}
