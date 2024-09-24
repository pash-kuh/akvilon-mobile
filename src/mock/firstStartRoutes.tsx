import CityScreen from '@src/screens/Main/SettingsScreen/SettingsCityScreen';
import SignInScreen from '@src/screens/Main/SettingsScreen/SettingsProfileScreen/ProfileSignScreen/SignInScreen';
import { TouchableWithoutFeedback } from 'react-native';
import { Text } from 'react-native-paper';
import { icon, typography } from '@src/assets/style/typography.style';
import React from 'react';
import LoadingScreen from '@src/screens/Loading';
import SignUpScreen from '@src/screens/Main/SettingsScreen/SettingsProfileScreen/ProfileSignScreen/SignUpScreen';
import SignMsgScreen from '@src/screens/Main/SettingsScreen/SettingsProfileScreen/ProfileSignScreen/SignMsgScreen';
import ErrorScreen from '@src/screens/Error';
import EmptyScreen from '@src/screens/EmptyScreen';
import { BRAND_RED_50, GREY_50, GREY_70 } from '@src/assets/style/variable.style';
import MainPageScreen from '@src/screens/Main/MainPageScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const tabBarIcon = (focused, iconText: string) => {
  if (focused) {
    return <Text style={[icon(24), { color: BRAND_RED_50 }]}>{iconText}</Text>;
  }
  return <Text style={icon(24)}>{iconText}</Text>;
};

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
      headerTitle: '',
      headerShadowVisible: false,
      headerRight: (navigation) => (
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate('City', {
              alredyLaunched: '1',
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
      ),
      isWebView: false,
    },
    initialParams: {
      onlyPhone: false,
    },
  },
  {
    name: 'SettingProfileSignSignUp',
    component: SignInScreen,
    options: {
      headerShown: true,
      headerTitle: '',
      headerShadowVisible: false,
    },
    initialParams: {
      route: '',
      signup: true,
    },
  },
  {
    name: 'SettingProfileSignMsg',
    component: SignMsgScreen,
    options: {
      headerShown: true,
      headerTitle: '',
      headerShadowVisible: false,
      isWebView: false,
    },
    initialParams: {
      route: '',
      signup: true,
    },
  },
  {
    name: 'SettingProfileSignSignInOnyPhone',
    component: SignInScreen,
    options: {
      headerShown: true,
      headerShadowVisible: false,
      isWebView: false,
      headerRight: () => null,
    },
    initialParams: {
      route: '',
      onlyPhone: true,
      signup: false,
    },
  },
  {
    name: 'SettingProfileSignSignInSMS',
    component: SignMsgScreen,
    options: {
      headerShown: true,
      headerTitle: '',
      headerShadowVisible: false,
      isWebView: false,
    },
    initialParams: {
      route: '',
      signup: false,
    },
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
  {
    name: 'MainPageScreen',
    tab: 'MainPage',
    component: MainPageScreen,
    options: {
      headerShown: false,
      tabBarLabel: 'Главная',
      headerTitle: 'Главная',
      tabBarIcon: ({ focused }) => tabBarIcon(focused, ''),
      tabBarActiveTintColor: BRAND_RED_50,
      tabBarInactiveTintColor: GREY_70,
      isWebView: false,
    },
    initialParams: {
      route: '/',
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
      tabBarIcon: ({ focused }) => tabBarIcon(focused, ''),
      tabBarActiveTintColor: BRAND_RED_50,
      tabBarInactiveTintColor: GREY_70,
      isWebView: true,
    },
    initialParams: {
      route: '/brands/',
    },
  },
];
