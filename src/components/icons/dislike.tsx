import Svg, {Path} from 'react-native-svg';
import React, {Component} from 'react';
import {BRAND_RED_50} from '@src/assets/style/variable.style';
/**
 * Иконка дизлайка
 *
 * @category Icon
 */
export class DislikeIcon extends Component<{
  active: boolean;
}> {
  constructor(props) {
    super(props);
  }

  render() {
    const {props} = this;
    return (
      <Svg width={80} height={80} viewBox="0 0 80 80">
        <Path
          d="M40.0002 0C17.9102 0 0.000152588 17.91 0.000152588 40C0.000152588 62.09 17.9102 80 40.0002 80C62.0902 80 80.0002 62.09 80.0002 40C80.0002 17.91 62.0902 0 40.0002 0Z"
          fill={props && props.active ? BRAND_RED_50 : '#F2F5F8'}
        />
        <Path
          d="M20.7637 42.7107L20.7303 42.874L20.7437 42.8907C20.7037 43.1473 20.667 43.4007 20.667 43.6673C20.667 46.4273 22.907 48.6673 25.667 48.6673H41.5003C41.5003 48.6673 39.8337 55.8473 39.8337 58.6673C39.8337 62.4207 42.257 65.334 45.5903 65.334H47.3336V60.7873L50.4436 50.5106C51.607 48.3473 53.8636 47.0007 56.317 47.0007H57.3336L57.3336 25.334H54.0003C51.867 23.2007 48.9703 22.0007 45.9537 22.0007H29.0003C26.5936 22.0007 24.5837 23.704 24.1103 25.9707L24.107 25.9807C24.1036 25.9907 24.1003 25.9973 24.1003 26.0073L20.7836 42.614C20.777 42.6473 20.7703 42.6773 20.7637 42.7107Z"
          fill={props && props.active ? '#FFFFFF' : '#A0AFBD'}
        />
      </Svg>
    );
  }
}
