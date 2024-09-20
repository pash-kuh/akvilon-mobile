import React, {useEffect, useState} from 'react';
import {fetchCities, getActiveCity} from '@src/store/modules/city/CityActions';
import {
  checkUserFirstLogin,
  checkUserSelectCity,
} from '@src/helpers/common/checkers';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@src/store';
import SplashScreen from 'react-native-splash-screen';
import {
  fetchUserInfo,
  fetchUserLoyaltyCard,
  fetchUserLoyaltyQrCode,
  getUserToken,
} from '@src/store/modules/user/UserActions';
import {checkConnection} from '@src/helpers/connection';
import {getReviewStatus} from '@src/store/modules/review/ReviewActions';
import {setCookie} from '@src/helpers/webview/cookie';
import {getRemoteConfig} from '@src/store/modules/config/ConfigActions';
import {setRoute} from '@src/store/modules/webview/WebviewReducer';
import {StackActions, useNavigation} from '@react-navigation/native';
import {setUrl} from '@src/store/modules/config/ConfigReducer';
import DeviceInfo from 'react-native-device-info';
import CustomLoader from '@src/components/general/CustomLoader';
import {View} from 'react-native';

//Компонент загрузки приложения
export default function LoadingScreen() {
  const navigation = useNavigation();
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const {config} = useSelector((s: RootState) => s);
  const versionInfo = DeviceInfo.getVersion();
  const mobileOS = DeviceInfo.getSystemName();
  const versionOS = DeviceInfo.getSystemVersion();

  useEffect(() => {
    setLoading(true);
    let initialRoute = 'Error';
    const handleInit = (route) => {
      setTimeout(() => {
        navigation.dispatch(
          StackActions.replace(route, {
            type: 'initial',
          }),
        );
      }, 2000);
      SplashScreen.hide();
    };
    (async () => {
      const isConnected = await checkConnection();
      if (!isConnected) {
        return handleInit(initialRoute);
      }
      await dispatch(getReviewStatus());
      await dispatch(fetchCities({url: config.apiUrl})).unwrap();
      const url = await dispatch(getRemoteConfig()).unwrap();
      dispatch(setUrl(url));
      await dispatch(getReviewStatus()).unwrap();
      await setCookie(url, {name: 'isMobile', value: '1'});
      await setCookie(url, {name: 'mobileVersionNumber', value: versionInfo});
      await setCookie(url, {name: 'mobileOS', value: mobileOS});
      await setCookie(url, {name: 'versionOS', value: versionOS});
      try {
        const token = await dispatch(getUserToken()).unwrap();
        if (token) {
          await dispatch(setRoute(`auth|${token}`));
          await setCookie(url, {
            name: 'token',
            value: token,
          });
          const user = await dispatch(
            fetchUserInfo({token: token, url: config.apiUrl}),
          ).unwrap();
          await dispatch(
            fetchUserLoyaltyCard({token: token, url: config.apiUrl}),
          ).unwrap();
          if (user?.loyalty?.balance) {
            await dispatch(
              fetchUserLoyaltyQrCode({
                token: token,
                url: config.apiUrl,
              }),
            );
          }
        }
      } catch (e) {}
      initialRoute = await checkUserFirstLogin();
      if (initialRoute === 'Auth') {
        return handleInit(initialRoute);
      }

      try {
        await Promise.all([]);
        const city = await dispatch(getActiveCity()).unwrap();
        await setCookie(url, {
          name: 'pickedCity',
          value: city,
        });
        initialRoute = checkUserSelectCity(city);
      } catch (e) {
        console.error(e);
      } finally {
        handleInit(initialRoute);
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return loading ? (
    <View style={{flex: 1}}>
      <CustomLoader loading={loading} />
    </View>
  ) : null;
}
