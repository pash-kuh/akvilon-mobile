/**
 * @module Screen
 */

import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@src/store';
import {
  setRoute,
  setTitle,
  setLoading,
} from '@src/store/modules/webview/WebviewReducer';
import {useEffect} from 'react';
import pages from '@src/mock/pages.json';
import {groupUsers} from '@src/mock/settings/pages';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ParamList} from '@src/types/route';

type ParamsList = {
  EmptyScreen: {
    route: string;
    isWebPage: boolean;
  };
};

//Компонент в котором происходит навигация и отрисовка страниц webview
export default function EmptyScreen() {
  const {webview} = useSelector((state: RootState) => state);
  const dispatch: AppDispatch = useDispatch();
  const route = useRoute<RouteProp<ParamsList, 'EmptyScreen'>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<ParamList['Main']>>();

  const checkOnRoute = groupUsers.some((item) => item.name === route.name);
  useEffect(() => {
    //При переходе в бренды
    if (route.params.route.includes('/brands/')) {
      return;
    }
    //Для того, чтобы срабатывала логика проверки по заголовку
    if (webview.tab === 'MainPage') {
      dispatch(setTitle(webview.title));
    }
    if (webview.title === 'Профиль' && !route.params.route) {
      navigation.navigate('SettingMainScreen');
    }
    if (
      webview.route !== `redirect|${route.params.route}` &&
      (webview.route.includes('changeCity') || !route.params.isWebPage)
    ) {
      if (pages[route.name]) {
        dispatch(setTitle(pages[route.name]));
      }
      dispatch(setRoute(`redirect|${route.params.route}`));
    }
    //Проверка, если пользователь перешёл на смету из корзины
    if (
      (route?.params?.route?.includes('cart') &&
        webview.route.includes('estimate')) ||
      (webview.route.includes('cart') &&
        route?.params?.route?.includes('estimate'))
    ) {
      dispatch(setRoute('redirect|/cart/'));
      dispatch(setTitle('Корзина'));
      navigation.navigate('CartMainScreen');
    }
    //Проверка, если пользователь перешёл на калькулятор товаров из корзины
    if (
      route.params.route === '/calculator/' &&
      !webview.route.includes('cart')
    ) {
      dispatch(setTitle('Строительный калькулятор'));
      dispatch(setRoute('redirect|/calculator/'));
    }
    //Проверка, если пользователь перешёл на калькулятор товаров из корзины
    if (
      webview.route.includes('cart') &&
      route?.params?.route?.includes('calculat')
    ) {
      dispatch(setRoute('redirect|/cart/'));
      navigation.navigate('CartMainScreen');
    }
    //Смена роута и заголовка при переходе в калькулятор
    if (route.params.route === '/calculations/') {
      dispatch(setTitle('Строительный калькулятор'));
      dispatch(setRoute('redirect|/calculations/'));
    }
    //Смена роута и заголовка при переходе в сметы
    if (route.params.route === '/personal/estimates/') {
      dispatch(setTitle('Мои сметы'));
      dispatch(setRoute(`redirect|${route.params.route}`));
    }
  }, [
    webview.route,
    dispatch,
    route.params.route,
    webview.tab,
    webview.title,
    route.params.isWebPage,
    route.name,
    navigation,
  ]);
  //Лоадер для webview при переходе из профиля по вкладкам меню
  useEffect(() => {
    if (checkOnRoute) {
      dispatch(setLoading(true));
      setTimeout(() => {
        dispatch(setLoading(false));
      }, 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
