import React, {Component} from 'react';
import BarcodeScanner from '@src/components/general/BarcodeScanner';
import {NavigationProps} from '@src/types/route';
import {CityItem, CityState} from '@src/store/modules/city/CityTypes';
import {connect} from 'react-redux';
import {AppDispatch} from '@src/store';
import {WebviewState} from '@src/store/modules/webview/WebviewTypes';
import {setHideTabBar} from '@src/store/modules/webview/WebviewReducer';

/**
 * Сканер штрихкодов
 *
 * @category CameraScreen Screen
 */

export class CameraScreen extends Component<
  {
    city: CityState;
    webview: WebviewState;
    dispatch: AppDispatch;
    navigation: NavigationProps<'Camera'>['navigation'];
    route: NavigationProps<'Camera'>['route'];
  },
  {
    cityId: string;
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      cityId: '',
    };
  }

  componentDidMount() {
    this.props.dispatch(setHideTabBar(true));
    if (!this.props.city?.active) {
      this.props.navigation.navigate('City');
    } else {
      const pickedCity: CityItem[] = this.props.city.list.filter(
        (c) => c.code === this.props.city.active,
      );
      this.setState({
        cityId: pickedCity[0].id,
      });
    }
  }

  componentWillUnmount() {
    this.props.dispatch(setHideTabBar(false));
  }

  goNotFound = () => {
    this.props.navigation.navigate('CameraNotFoundScreen');
  };

  goHome = () => {
    this.props.navigation.goBack();
  };

  openProduct = (navigation, productCode) => {
    this.props.navigation.navigate('CatalogProductScreen', {
      route: `/p/${productCode}/`,
    });
  };

  render() {
    return (
      <BarcodeScanner
        goHome={this.goHome}
        goNotFound={this.goNotFound}
        openProduct={this.openProduct}
        city={this.state.cityId}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const {city, webview} = state;
  return {city, webview};
};

export default connect(mapStateToProps)(CameraScreen);
