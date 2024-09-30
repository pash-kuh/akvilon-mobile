import React, {useEffect, useRef} from 'react';
import WebView from 'react-native-webview';
import {Alert, StyleSheet, View, Linking, Platform} from 'react-native';
import {
  setLoading,
  setRoute,
  setTab,
  setTitle,
  setWebviewOpen,
} from '@src/store/modules/webview/WebviewReducer';
import {AppDispatch, RootState} from '@src/store';
import {useDispatch, useSelector} from 'react-redux';
import {
  CommonActions,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import {MessageParser} from '@src/helpers/webview/onMessage';
import {setCartCount} from '@src/store/modules/cart/CartReducer';
import {Camera} from 'react-native-vision-camera';
import CustomLoader from '@src/components/general/CustomLoader';
import {setUserToken} from '@src/store/modules/user/UserActions';
import {setCookie} from '@src/helpers/webview/cookie';
import checkVersion from '../common/versionChecker';
import InAppReview from '@src/modules/InAppReview';
import {
  setLoyalty,
  setLoyaltyNumber,
  setPhone,
} from '@src/store/modules/user/UserReducer';
import {setFilterOpen} from '@src/store/modules/mobileConfig/MobileConfigReducer';
import {setFavorite} from '@src/store/modules/favorites/FavoriteReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type WebComponentInterface = {
  viewStyle?: any;
  state?: any;
  setRef: any;
};

export function WebComponent(props: WebComponentInterface) {
  const {viewStyle, state, setRef} = props;
  const navigation = useNavigation<any>();
  const {webview, config, review, user} = useSelector(
    (state: RootState) => state,
  );
  const dispatch: AppDispatch = useDispatch();
  const webviewRef = useRef(null);
  useEffect(() => {
    if (webview.route !== webview.routeNow) {
      const [message, to] = webview.route.split('|');
      const data = JSON.stringify({message, to});
      const run = `window.$nuxt.$rn.postMessage(${data})`;
      webviewRef.current.injectJavaScript(run);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webview.route]);

  useEffect(() => {
    setRef(webviewRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleOpenSettings = async () => {
    if (Platform.OS === 'ios') {
      await Linking.openURL('app-settings:');
    } else {
      await Linking.openSettings();
    }
  };
  useEffect(() => {
    if (Platform.OS === 'android') {
      if (
        !checkVersion(user.currentVersionNumber.vAndroid, user.versionNumber) &&
        user.updateModalOpen.vAndroid
      ) {
        Alert.alert(
          'Обновить приложение',
          'Это необходимо, чтобы приложение работало стабильно',
          [
            {
              text: 'Позже',
              style: 'cancel',
            },
            {
              text: 'Ок',
              onPress: async () => await InAppReview.RequestInAppReview(),
            },
          ],
        );
      }
    } else {
      if (
        !checkVersion(user.currentVersionNumber.viOS, user.versionNumber) &&
        user.updateModalOpen.viOS
      ) {
        Alert.alert(
          'Обновить приложение',
          'Это необходимо, чтобы приложение работало стабильно',
          [
            {
              text: 'Позже',
              style: 'cancel',
            },
            {
              text: 'Ок',
              onPress: async () => await InAppReview.RequestInAppReview(),
            },
          ],
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkCameraPermission = async () => {
    let status = await Camera.getCameraPermissionStatus();
    if (status !== 'granted') {
      await Camera.requestCameraPermission();
      status = await Camera.getCameraPermissionStatus();
      if (status === 'granted') {
        navigation.navigate('Camera');
      } else if (status === 'denied') {
        Alert.alert(
          'Доступ к камере',
          'Вы не сможете сканировать штрихкоды, если не разрешите доступ к камере. Разрешите использование камера для сканирования штрихкода товара в магазине',
          [
            {
              text: 'Отмена',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'Разрешить', onPress: () => handleOpenSettings()},
          ],
        );
      }
    } else if (status === 'granted') {
      navigation.navigate('Camera');
    }
  };

  useEffect(() => {
    if (
      webview.tab !== 'MainPage' &&
      webview.tab !== 'Setting' &&
      !webview.webviewOpen
    ) {
      dispatch(setLoading(true));
      const timeout = setTimeout(() => {
        dispatch(setLoading(false));
        dispatch(setWebviewOpen(true));
      }, 4500);

      return () => {
        dispatch(setLoading(false));
        clearTimeout(timeout);
      };
    }
    if (
      webview.tab !== 'MainPage' &&
      webview.tab !== 'Setting' &&
      webview.webviewOpen
    ) {
      dispatch(setLoading(true));
      const timeout = setTimeout(() => {
        dispatch(setLoading(false));
      }, 1500);

      return () => {
        dispatch(setLoading(false));
        clearTimeout(timeout);
      };
    }
    if (webview.tab === 'Home') {
      dispatch(setTab('MainPage'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webview.tab]);
  const onMessageHandler = async (e) => {
    const {type, ...body}: any = new MessageParser(
      JSON.parse(e.nativeEvent.data),
    ).init();
    if (body.code === 'filters_open') {
      dispatch(setFilterOpen(true));
    } else if (body.code === 'filters_close') {
      dispatch(setFilterOpen(false));
    } else {
      dispatch(setFilterOpen(false));
    }
    if (type === 'favorites') {
      await setCookie(config.url, {
        name: 'favoritesArray',
        value: body.favorites,
      });
      const favsFromWeb = JSON.parse(body.favorites);
      const updatedFavs = favsFromWeb.map((item: any) => {
        return {
          code: item,
        };
      });
      dispatch(setFavorite(updatedFavs));
      await AsyncStorage.setItem('favoritesArray', JSON.stringify(updatedFavs));
      // console.log(body)
    }
    if (type === 'page') {
      const lastRoute = state.routes[state.routes.length - 1];
      const [_, to] = webview.route.split('|');
      dispatch(setTitle(body.title));
      if (lastRoute.params.route === body.param) {
        return false;
      }
      if (to && body.tab) {
        if (body.screen === 'CatalogFilterScreen') {
          // navigation.navigate(body.screen, {
          //   isWebPage: true,
          //   route: body.param,
          // });
        } else if (body.param) {
          if (webview.tab === body.tab) {
            if (body.screen === 'HomeMainScreen') {
              navigation.dispatch(
                StackActions.push('MainPageScreen', {
                  isWebPage: false,
                }),
              );
            } else {
              navigation.dispatch(
                StackActions.push(body.screen, {
                  isWebPage: true,
                  route: body.param,
                }),
              );
            }
          } else {
            if (body.screen === 'HomeMainScreen') {
              navigation.dispatch(
                StackActions.push('MainPageScreen', {
                  isWebPage: false,
                }),
              );
            } else {
              navigation.dispatch(
                StackActions.push(body.screen, {
                  initial: false,
                  isWebPage: true,
                  route: body.param,
                }),
              );
            }
          }
        } else {
          if (body.screen === 'HomeMainScreen') {
            navigation.dispatch(
              StackActions.push('MainPageScreen', {
                isWebPage: false,
              }),
            );
          } else {
            navigation.dispatch(StackActions.push(body.screen));
          }
        }
        // if (body.screen === 'HomeMainScreen') {
        //   navigation.dispatch(
        //     CommonActions.reset({
        //       index: 0,
        //       routes: [{name: body.screen}],
        //     }),
        //   );
        // }
        dispatch(setTab(body.tab));
        // dispatch(setRouteNow(to));
      }
    }
    if (type === 'auth') {
      await dispatch(setRoute('redirect|/empty/'));
      if (webview.route === '/catalog/') {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'SettingMainScreen'}, {name: 'Auth'}],
          }),
        );
      }
      await dispatch(setTab(webview.tab));
    }
    if (type === 'camera') {
      await checkCameraPermission();
    }
    if (type === 'cart') {
      await dispatch(setCartCount(body.body));
    }
    if (type === 'review') {
      if (!review.status && review.reviewStatus !== 'refused') {
        navigation.navigate('FeedbackDrawer', {
          margin: '-200%',
        });
      } else if (review.reviewStatus === 'wait' && !review.status) {
        navigation.navigate('FeedbackDrawer', {
          margin: '-200%',
        });
      }
    }
    if (type === 'qrCode') {
      navigation.navigate('QrCodeDrawer', {
        margin: '0',
      });
      dispatch(setLoyaltyNumber(body.cardNumber));
    }
    if (type === 'back') {
      navigation.goBack();
    }
    if (type === 'logout') {
      dispatch(setRoute('logout|default'));
      dispatch(setUserToken(''));
      dispatch(setPhone(''));
      dispatch(setCartCount(0));
      dispatch(setLoyalty());
      dispatch(setFavorite([]));
      await AsyncStorage.removeItem('favoritesArray');
      await setCookie(config.url, {
        name: 'favoritesArray',
        value: JSON.stringify([]),
      });
      await setCookie(config.url, {
        name: 'token',
        value: '',
      });
      return;
    }
  };

  return (
    <View style={[style.container, viewStyle]}>
      <WebView
        // onLoadStart={() => {
        //   dispatch(setLoading(true));
        // }}
        // onLoadEnd={() => {
        //   dispatch(setLoading(false));
        // }}
        ref={webviewRef}
        source={{
          uri: `https://${config.url}`,
        }}
        // cacheEnabled={true}
        onMessage={onMessageHandler}
        androidHardwareAccelerationDisabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        bounces={false}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
      />
      {webview.loading &&
        webview.title !== 'Профиль' &&
        webview.tab !== 'MainPage' &&
        !webview.route.includes('changeCity') && (
          <View style={{height: '100%'}}>
            <CustomLoader loading={webview.loading} />
          </View>
        )}
    </View>
  );
}

export const WebviewComponent = React.memo(WebComponent);

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});
