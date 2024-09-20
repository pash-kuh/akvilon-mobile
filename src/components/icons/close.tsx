import React, {Component} from 'react';
import Svg, {Path, Rect} from 'react-native-svg';
import {TouchableOpacity, ViewStyle} from 'react-native';
/**
 * Иконка крестика
 *
 * @category Icon
 */
export class CloseIcon extends Component<{
  onPress?: () => void;
  style?: ViewStyle;
  width?: number;
  height?: number;
  color?: string;
}> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity
        style={this.props.style}
        onPress={() => this.props.onPress()}>
        <Svg
          width={this.props.width || 40}
          height={this.props.height || 40}
          viewBox="0 0 40 40">
          <Path
            d="M11 11L20 20M20 20L29 11M20 20L29 29M20 20L11 29"
            stroke={this.props.color || '#C4CCD4'}
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </Svg>
      </TouchableOpacity>
    );
  }
}
