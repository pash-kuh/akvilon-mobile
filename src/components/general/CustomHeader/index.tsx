import React, {useCallback, useEffect, useState} from 'react';
import {BackHandler, Platform, StyleSheet} from 'react-native';
import {Appbar} from 'react-native-paper';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {
  setAction,
  setTab,
  setTitle,
} from '@src/store/modules/webview/WebviewReducer';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@src/store';

const CATEGORY_ROUTES = [
  'СТРОИТЕЛЬНЫЕ МАТЕРИАЛЫ',
  'ИНЖЕНЕРНЫЕ СИСТЕМЫ',
  'ЭЛЕКТРИКА',
  'КРЕПЕЖ',
  'САНТЕХНИКА',
  'ИНТЕРЬЕР И ОТДЕЛКА',
  'ИНСТРУМЕНТ',
  'ТОВАРЫ ДЛЯ ДОМА',
  'Распродажа',
];

const backArrowLink =
  Platform.OS === 'ios'
    ? require('@src/assets/svg/back-arrow.ios.png')
    : require('@src/assets/svg/back-arrow.android.png');

export function Header({
  navigation,
  state,
  options,
  webview,
  navigationGoBackHandle,
}: {
  options: any;
  navigation: any;
  state: any;
  webview: any;
  navigationGoBackHandle: () => void;
}) {
  const {mobileConfig} = useSelector((s: RootState) => s);
  const dispatch = useDispatch();
  const [sms, setSms] = useState(false);
  const rootArray = [
    {title: 'Главная', tab: 'MainPage'},
    {title: 'Каталог', tab: 'Catalog'},
    {title: 'Корзина', tab: 'Cart'},
    {title: 'Профиль', tab: 'Setting'},
  ];

  const checkOnCategoryTitle = () => {
    const checkOnCategroy = CATEGORY_ROUTES.some(
      (item) => item === webview.title,
    );
    if (checkOnCategroy) {
      return false;
    }
    return true;
  };

  //Проверяем показывать ли кнопку(иконку) "Назад" или нет
  const checkOnRootTab = () => {
    const checkOnRoot = rootArray.some((item) => item.title === webview.title);
    if (checkOnRoot) {
      return false;
    }
    return true;
  };
  useEffect(() => {
    checkOnRootTab();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webview.title]);
  useEffect(() => {
    const newState = {...state};
    newState.routes = [
      ...new Map(
        newState.routes.map((item) => [item.params.route, item]),
      ).values(),
    ];

    if (newState.routes.length !== state.routes.length) {
      navigation.dispatch(
        CommonActions.reset({
          routes: newState.routes,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.routes]);

  //Проверка на показ хэдера для таба поиска
  const checkOnHeader =
    state.routes.length &&
    ((webview.route.includes('rn-search') &&
      state.routes[0] &&
      state.routes[0].params?.route?.includes('rn-search')) ||
      !(
        webview.route.includes('rn-search') &&
        state.routes[1] &&
        state.routes[1].params?.route?.includes('catalog')
      ));

  //Обработка различных кейсов при клике "Назад"
  const handleClick = () => {
    if (webview.action === 'return') {
      navigation.navigate('MainPageScreen');
      dispatch(setAction(''));
      dispatch(setTab('MainPage'));
      return;
    }
    if (!checkOnCategoryTitle() || webview.route.includes('brands')) {
      navigation.navigate('MainPageScreen');
      dispatch(setAction(''));
      dispatch(setTab('MainPage'));
      return;
    }
    if (webview.title === 'Вход в личный кабинет') {
      navigation.navigate('SettingMainScreen');
      dispatch(setTab('MainPage'));
      dispatch(setTitle('Профиль'));
      return;
    }
    if (
      state.routes &&
      webview.tab !== 'Cart' &&
      webview.tab !== 'Setting' &&
      !state.routes.some((route) => route.name === 'Camera')
    ) {
      if (
        webview.route.includes('rn-search') &&
        state.routes[0] &&
        state.routes[0].params.route.includes('rn-search')
      ) {
        dispatch(setTitle('Поиск'));
      }
      navigationGoBackHandle();
    } else {
      navigation.goBack();
    }
  };
  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        if (
          state.routes &&
          webview.tab !== 'Cart' &&
          webview.tab !== 'Setting'
        ) {
          navigationGoBackHandle();
          return true;
        } else {
          navigation.goBack();
          return false;
        }
      };
      BackHandler.addEventListener('hardwareBackPress', backAction);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, [navigation, navigationGoBackHandle, state.routes, webview.tab]),
  );

  useEffect(() => {
    if (webview.title === 'Вход по СМС') {
      setSms(true);
    } else {
      setSms(false);
    }
  }, [webview.title]);

  const headerShow =
    options.headerShown && webview.title !== 'Поиск' && checkOnHeader;

  if (!headerShow) {
    return null;
  }

  return (
    <Appbar.Header style={{...style.header}}>
      {checkOnRootTab() && !mobileConfig.filterOpen && (
        <Appbar.Action icon={backArrowLink} onPress={() => handleClick()} />
      )}
      <Appbar.Content title={webview.title} />
      {options.headerRight && !sms && options.headerRight(navigation)}
    </Appbar.Header>
  );
}

const style = StyleSheet.create({
  header: {
    elevation: 0,
    backgroundColor: '#fff',
  },
});

export const CustomHeader = React.memo(Header);
