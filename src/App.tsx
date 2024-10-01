import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import handleBackHandler from '@src/helpers/common/backhandler';
import publicRoutes from '@src/mock/publicRoutes';
import tabRoutes from '@src/mock/tabroutes';
import { createTabNavigator } from '@src/helpers/router/TabRouter';
import { ParamList } from '@src/types/route';
import { sections } from '@src/mock/settings/pages';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firstStartRoutes from '@src/mock/firstStartRoutes';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/store';
import { setRoute } from '@src/store/modules/webview/WebviewReducer';
import {
  setMobileOS,
  setUpdateModalOpen,
  setVersionNumber,
  setVersionOS,
} from '@src/store/modules/user/UserReducer';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import DeviceInfo from 'react-native-device-info';
import { getVersionNumber } from '@src/store/modules/user/UserActions';

import { LogBox } from 'react-native';
import AppMetrica from '@appmetrica/react-native-analytics';
LogBox.ignoreLogs(['new NativeEventEmitter']);

export default function App() {
  const versionInfo = DeviceInfo.getVersion();
  const mobileOS = DeviceInfo.getSystemName();
  const versionOS = DeviceInfo.getSystemVersion();
  const { city, config } = useSelector((state: RootState) => state);
  const navigation = useNavigation();
  const dispatch: AppDispatch = useDispatch();
  const [routes] = useState([...publicRoutes, ...tabRoutes, ...sections]);
  const [Main, setMain] = useState(null);
  const [alreadyLaunched, setAlreadyLaunched] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        return handleBackHandler(navigation);
      };

      BackHandler.addEventListener('hardwareBackPress', backAction);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, []),
  );
  useFocusEffect(
    useCallback(() => {
      const handleDynamicLinks = (link) => {
        if (!(link && link.url)) {
          return false;
        }
        if (link.url === 'https://akvilon.kz/personal/orders/') {
          dispatch(setRoute('redirect|/personal/orders/'));
        }
        dynamicLinks().onLink(handleDynamicLinks);
        dynamicLinks().getInitialLink().then(handleDynamicLinks);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );
  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then((response) => {
      if (!response || !city.active) {
        setMain(createNativeStackNavigator());
        setAlreadyLaunched(false);
      } else {
        setMain(createTabNavigator<ParamList>());
        setAlreadyLaunched(true);
      }
    });
  }, [city.active]);

  const getVersionNumbers = async () => {
    const data = await dispatch(getVersionNumber(config.apiUrl));
    if (data && data.payload?.updated) {
      dispatch(setUpdateModalOpen(data.payload.updated));
    }
  };

  useEffect(() => {
    getVersionNumbers();
    dispatch(setVersionNumber(versionInfo));
    dispatch(setMobileOS(mobileOS));
    dispatch(setVersionOS(versionOS));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  AppMetrica.activate({
    apiKey: 'e340487a-04fd-43c8-9f0e-6c3aa8621ec4',
    sessionTimeout: 120,
    firstActivationAsUpdate: false,
  });

  AppMetrica.reportEvent('My event');

  if (Main === null) {
    return null;
  }

  return (
    <Main.Navigator
      initialRouteName="Loading"
      screenOptions={{ headerShown: false, lazy: false }}>
      {!alreadyLaunched
        ? firstStartRoutes.map((route, key) => (
          <Main.Screen
            key={key}
            name={route.name}
            component={route.component}
            options={{
              ...route.options,
              ...(route?.options?.headerRight
                ? { headerRight: () => route.options.headerRight(navigation) }
                : {}),
            }}
            initialParams={route.initialParams}
          />
        ))
        : routes.map((route, key) => (
          <Main.Screen
            key={key}
            name={route.name}
            component={route.component}
            options={route.options}
            initialParams={route.initialParams}
          />
        ))}
    </Main.Navigator>
  );
}
