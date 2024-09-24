import LoadingScreen from '@src/screens/Loading';
import CityScreen from '@src/screens/Main/SettingsScreen/SettingsCityScreen';
import EmptyScreen from '@src/screens/EmptyScreen';
import SignInScreen from '@src/screens/Main/SettingsScreen/SettingsProfileScreen/ProfileSignScreen/SignInScreen';
import { TouchableWithoutFeedback } from 'react-native';
import { Text } from 'react-native-paper';
import { typography } from '@src/assets/style/typography.style';
import React from 'react';
import AdminScreen from '@src/screens/AdminScreen';
import CameraScreen from '@src/screens/CameraScreen';
import CameraNotFoundScreen from '@src/screens/CameraScreen/cameraNotFound';
import FeedbackDrawer from '@src/components/drawers/feedbackDrawer';
import ErrorScreen from '@src/screens/Error';
import QrCodeDrawer from '@src/components/drawers/qrCodeDrawer';
import { GREY_50 } from '@src/assets/style/variable.style';

export default [
  {
    name: 'Loading',
    component: LoadingScreen,
    options: {
      headerShown: false,
      tabBarItemStyle: { display: 'none' },
      isWebView: false,
    },
    initialParams: {},
  },
  {
    name: 'City',
    component: CityScreen,
    options: {
      headerShown: true,
      headerTitle: 'Выберите город',
      headerShadowVisible: false,
      tabBarItemStyle: { display: 'none' },
      isWebView: false,
    },
    initialParams: {},
  },
  {
    name: 'Auth',
    component: SignInScreen,
    options: {
      headerShown: true,
      tabBarItemStyle: { display: 'none' },
      tabBarShown: false,
      headerTitle: '',
      isWebView: false,
      headerRight: (navigation) => {
        if (navigation) {
          return (
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.navigate('MainPageScreen', {
                  onlyPhone: true,
                });
              }}>
              <Text
                style={{
                  ...typography('xs', 'regular'),
                  color: GREY_50,
                }}>
                Продолжить без входа
              </Text>
            </TouchableWithoutFeedback>
          );
        }
      },
    },
    initialParams: {},
  },
  {
    name: 'Camera',
    component: CameraScreen,
    options: {
      headerShown: false,
      headerTitle: '',
      headerShadowVisible: false,
      headerStyle: { backgroundColor: 'transparent' },
      tabBarItemStyle: { display: 'none' },
      isWebView: false,
    },
    initialParams: {},
  },
  {
    name: 'CameraNotFoundScreen',
    component: CameraNotFoundScreen,
    options: {
      headerShown: false,
      headerTitle: '',
      headerShadowVisible: false,
      headerStyle: { backgroundColor: 'transparent' },
      tabBarItemStyle: { display: 'none' },
      isWebView: false,
    },
    initialParams: {},
  },
  {
    name: 'CatalogFilterScreen',
    component: EmptyScreen,
    options: {
      headerShown: true,
      animation: 'none',
      tabBarItemStyle: { display: 'none' },
      isWebView: true,
    },
    initialParams: {
      route: '',
    },
  },
  {
    name: 'CatalogProductScreen',
    component: EmptyScreen,
    options: {
      headerShown: true,
      animation: 'none',
      tabBarItemStyle: { display: 'none' },
      isWebView: true,
    },
    initialParams: {
      route: '',
    },
  },
  {
    name: 'CartOrderScreen',
    component: EmptyScreen,
    options: {
      headerShown: true,
      animation: 'none',
      tabBarItemStyle: { display: 'none' },
      isWebView: true,
    },
    initialParams: {
      route: '/order/',
    },
  },
  {
    name: 'BrandsScreen',
    tab: 'MainPage',
    component: EmptyScreen,
    options: {
      headerShown: true,
      tabBarLabel: 'Главная',
      headerTitle: 'Бренды',
      isWebView: true,
    },
    initialParams: {
      route: '/brands/',
    },
  },
  {
    name: 'AdminScreen',
    component: AdminScreen,
    options: {
      headerShown: true,
      animation: 'none',
      tabBarItemStyle: { display: 'none' },
      isWebView: false,
    },
    initialParams: {},
  },
  {
    name: 'FeedbackDrawer',
    component: FeedbackDrawer,
    options: {
      presentation: 'transparentModal',
      animation: 'none',
      headerShown: false,
      isWebView: false,
    },
    initialParams: {},
  },
  {
    name: 'QrCodeDrawer',
    component: QrCodeDrawer,
    options: {
      presentation: 'transparentModal',
      animation: 'none',
      headerShown: false,
      isWebView: false,
    },
    initialParams: {},
  },
  {
    name: 'Error',
    component: ErrorScreen,
    options: {
      headerShown: false,
      isWebView: false,
    },
    initialParams: {},
  },
];
