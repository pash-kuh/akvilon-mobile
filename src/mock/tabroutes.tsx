import { Text } from 'react-native';
import React from 'react';
import { BRAND_RED_50, GREY_70 } from '@src/assets/style/variable.style';
import { icon, typography } from '@src/assets/style/typography.style';
import EmptyScreen from '@src/screens/EmptyScreen';
import ProfileScreen from '@src/screens/Main/SettingsScreen/SettingsProfileScreen';
import MainPageScreen from '@src/screens/Main/MainPageScreen';

const tabBarIcon = (focused, iconText: string) => {
  if (focused) {
    return <Text style={[icon(24), { color: BRAND_RED_50 }]}>{iconText}</Text>;
  }
  return <Text style={icon(24)}>{iconText}</Text>;
};

export default [
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
    name: 'CatalogMainScreen',
    tab: 'Catalog',
    component: EmptyScreen,
    options: {
      headerShown: true,
      tabBarLabel: 'Каталог',
      headerTitle: 'Каталог',
      tabBarIcon: ({ focused }) => tabBarIcon(focused, ''),
      tabBarActiveTintColor: BRAND_RED_50,
      tabBarInactiveTintColor: GREY_70,
      isWebView: true,
    },
    initialParams: {
      route: '/catalog/',
    },
  },
  {
    name: 'SearchMainScreen',
    tab: 'Search',
    component: EmptyScreen,
    options: {
      headerShown: true,
      tabBarLabel: 'Поиск',
      headerTitle: 'Поиск',
      tabBarIcon: ({ focused }) => tabBarIcon(focused, ''),
      tabBarActiveTintColor: BRAND_RED_50,
      tabBarInactiveTintColor: GREY_70,
      isWebView: true,
    },
    initialParams: {
      route: '/rn-search/',
      scanner: '0',
    },
  },
  {
    name: 'CartMainScreen',
    tab: 'Cart',
    component: EmptyScreen,
    options: {
      headerShown: true,
      tabBarLabel: 'Корзина',
      headerTitle: 'Корзина',
      tabBarIcon: ({ focused }) => tabBarIcon(focused, ''),
      tabBarActiveTintColor: BRAND_RED_50,
      tabBarInactiveTintColor: GREY_70,
      tabBarBadge: 2,
      tabBarBadgeStyle: {
        ...typography('sm'),
        color: '#fff',
        backgroundColor: '#F00933',
        opacity: 1,
        zIndex: 1,
      },
      isWebView: true,
    },
    initialParams: {
      route: '/cart/',
    },
  },
  {
    name: 'SettingMainScreen',
    tab: 'Setting',
    component: ProfileScreen,
    options: {
      headerShown: true,
      tabBarLabel: 'Профиль',
      headerTitle: 'Профиль',
      tabBarIcon: ({ focused }) => tabBarIcon(focused, ''),
      tabBarActiveTintColor: BRAND_RED_50,
      tabBarInactiveTintColor: GREY_70,
      isWebView: false,
    },
    initialParams: {
      route: '/cart/',
    },
  },
];
