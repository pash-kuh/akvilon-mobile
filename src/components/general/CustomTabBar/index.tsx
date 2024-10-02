import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Appbar, Badge} from 'react-native-paper';
import {icon} from '@src/assets/style/typography.style';
import tabRoutes from '@src/mock/tabroutes';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@src/store';
import {BRAND_RED_50, GREY_70, TAB_BAR_HEIGHT} from '@src/assets/style/variable.style';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {setTab} from '@src/store/modules/webview/WebviewReducer';
import {ParamList} from '@src/types/route';

export function TabBar() {
  const {cart, webview} = useSelector((state: RootState) => state);
  const dispatch: AppDispatch = useDispatch();
  const [time] = useState(null);
  const [routes] = useState([...tabRoutes]);
  const [clickSum, setClickSum] = useState(0);
  const navigation =
    useNavigation<NativeStackNavigationProp<ParamList['Main']>>();
  const [timer, setTimer] = useState(null);

  const handlePress = (route) => {
    if (route === 'MainPageScreen') {
      dispatch(setTab('MainPage'));
    }
    if (route === 'CatalogMainScreen') {
      dispatch(setTab('Catalog'));
      navigation.navigate('CatalogMainScreen', {
        isWebPage: true,
        route: `/catalog/`,
      });
    }
    if (route === 'SearchMainScreen') {
      dispatch(setTab('Search'));
      navigation.navigate('SearchMainScreen', {
        isWebPage: true,
        route: `/rn-search/`,
      });
    }
    if (route === 'CartMainScreen') {
      dispatch(setTab('Cart'));
      navigation.navigate('CartMainScreen', {
        isWebPage: true,
        route: `/cart/`,
      });
    }
    if (route === 'SettingMainScreen') {
      clearTimeout(timer);
      if (clickSum === 10) {
        console.log(clickSum);
        navigation.navigate('AdminScreen');
        setClickSum(0);
      }
      setClickSum(clickSum + 1);
      setTimer(
        setTimeout(() => {
          setClickSum(0);
        }, 1500),
      );
    }
    if (!webview.loading && clickSum === 0) {
      clearTimeout(time);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: route}],
        }),
      );

      // dispatch(setLoading(true));
      // setTime(
      //   setTimeout(() => {
      //     dispatch(setLoading(false));
      //   }, 1000),
      // );
    }
  };
  return (
    <Appbar
      style={[
        style.container,
        {display: webview.hideTabBar ? 'none' : 'flex', height: webview.hideTabBar ? 0 : TAB_BAR_HEIGHT},
      ]}>
      {routes.map((route, key) => {
        const isCart = route.name === 'CartMainScreen' && !!cart.cartCount;
        const isActive = route.tab === webview.tab;

        return (
          <TouchableOpacity
            key={key}
            style={[style.wrapper]}
            onPress={() => {
              handlePress(route.name);
            }}>
            {isCart && (
              <Badge size={16} style={style.badge}>
                {cart.cartCount}
              </Badge>
            )}
            {route.options.tabBarIcon({focused: isActive})}
            <Text
              style={[style.text, {color: isActive ? BRAND_RED_50 : GREY_70}]}>
              {route.options.tabBarLabel}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Appbar>
  );
}

export const CustomTabBar = React.memo(TabBar);

const style = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    justifyContent: 'space-around',
    elevation: 0,
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  action: {
    ...icon(24),
  },
  text: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  badge: {
    fontSize: 12,
    color: '#fff',
    position: 'absolute',
    top: -4,
    right: '10%',
    backgroundColor: '#F00933',
    opacity: 1,
    zIndex: 1,
  },
});
