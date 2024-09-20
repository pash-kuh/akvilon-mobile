import React, {useEffect} from 'react';
import {Linking, Platform, ScrollView, StyleSheet} from 'react-native';
import {Divider, List} from 'react-native-paper';
import {typography} from '@src/assets/style/typography.style';
import {ACCENT_50, GREY_50, GREY_90} from '@src/assets/style/variable.style';
import {useDispatch, useSelector} from 'react-redux';
import {
  groupAbout,
  groupAuth,
  groupContact,
  groupNoAuth,
  groupNoLoyalty,
  groupNoAuthNoLoyalty,
  groupUsers,
} from '@src/mock/settings/pages';
import {setUserToken} from '@src/store/modules/user/UserActions';
import {AppDispatch, RootState} from '@src/store';
import {
  setRoute,
  setTab,
  setTitle,
} from '@src/store/modules/webview/WebviewReducer';
import {setCartCount} from '@src/store/modules/cart/CartReducer';
import {setCookie} from '@src/helpers/webview/cookie';
import {
  StackActions,
  useNavigation,
  useRoute,
  CommonActions,
  RouteProp,
} from '@react-navigation/native';
import {setLoyalty, setPhone} from '@src/store/modules/user/UserReducer';
import {setFavorite} from '@src/store/modules/favorites/FavoriteReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
/**
 * Regular description
 *
 * @category Screen
 */

type ParamsList = {
  ProfileScreen: {
    route: string;
    isWebPage: boolean;
  };
};

export default function ProfileScreen() {
  const {city, user, config} = useSelector((state: RootState) => state);
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation();
  const router = useRoute<RouteProp<ParamsList, 'ProfileScreen'>>();
  const isLoyalty = () => user?.loyalty?.activated || false;
  const isAuth = () => !!user.token;
  const sectionLogOut = () => [
    {
      title: '',
      data: [
        {
          options: {
            headerTitle: 'Выход',
          },
          name: 'logout',
        },
      ],
    },
  ];
  const sections = () => [
    {
      title: '',
      data: [
        ...(!isLoyalty() && isAuth() ? groupNoLoyalty : []),
        ...(!isAuth() ? groupNoAuthNoLoyalty : []),
        ...(isAuth() ? groupAuth(isLoyalty()) : groupNoAuth),
      ],
    },
    {
      title: 'Выбранный город',
      data: [
        {
          options: {
            headerTitle: city.list.find((item) => city.active === item.code)
              ?.name,
          },
          name: 'City',
          left: () => {
            return <List.Icon icon={require('@src/assets/svg/geo.png')} />;
          },
        },
      ],
    },
    {
      title: 'Покупателю',
      data: groupUsers,
    },
    {
      title: 'О компании',
      data: groupAbout,
    },
    {
      title: '',
      data: groupContact,
    },
    ...(isAuth() ? sectionLogOut() : []),
  ];
  const currentItemClass = ({row}, {iIndex}) => {
    if (row.title === 'Выбранный город') {
      return cityItemStyle;
    }
    if (iIndex === row.data.length - 1) {
      return lastItemStyle;
    }
    return itemStyle;
  };
  const currentTitleClass = ({row}) => {
    if (row.title === 'Выбранный город') {
      return style.cityTitle;
    }
    return style.title;
  };
  const handlePress = async (item) => {
    const {name} = item;
    if (name === 'SettingVacancy') {
      const {route} = item.initialParams;
      await Linking.openURL(route);
      return;
    }
    if (name === 'logout') {
      dispatch(setRoute('logout|default'));
      dispatch(setUserToken(''));
      dispatch(setCartCount(0));
      dispatch(setPhone(''));
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
    navigation.dispatch(StackActions.push(name));
    dispatch(setTitle(item.headerTitle));
  };

  useEffect(() => {
    if (
      router &&
      (router.params.route === '/calculator/' ||
        router.params.route === '/calculations/')
    ) {
      dispatch(setTitle('Строительный калькулятор'));
      dispatch(setTab('Setting'));
      dispatch(setRoute('redirect|/empty/'));
      router.params.route === '/calculator/'
        ? navigation.dispatch(StackActions.push('SettingCalculator'))
        : navigation.dispatch(
            StackActions.push('SettingCalculator', {
              route: '/calculations/',
            }),
          );
    } else if (router.params.route === '/activate/') {
      if (user?.loyalty?.activated) {
        dispatch(setTitle('Моя карта АКВИЛОН.BONUS'));
        dispatch(setRoute('redirect|/empty/'));
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {name: 'SettingMainScreen', params: {route: '/cart/'}},
              {name: 'SettingMyBonusCard', params: {route: 'redirect|/empty/'}},
            ],
          }),
        );
      } else {
        dispatch(setTitle('Моя карта АКВИЛОН.BONUS'));
        dispatch(setRoute('/personal/clubcard/?fullContentVisible=1/'));
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {name: 'SettingMainScreen', params: {route: '/empty/'}},
              {
                name: 'SettingActiveCard',
                params: {
                  route: '/personal/clubcard/?fullContentVisible=1/',
                },
              },
            ],
          }),
        );
      }
    } else {
      dispatch(setTitle('Профиль'));
      dispatch(setTab('Setting'));
      dispatch(setRoute('redirect|/empty/'));
    }
  });

  return (
    <ScrollView style={style.scrollView}>
      {sections()?.map((row, rIndex) => (
        <List.Section key={rIndex} style={style.section}>
          {row.title ? (
            <List.Subheader style={style.subheader}>{row.title}</List.Subheader>
          ) : null}
          {Platform.OS === 'ios' ? <Divider /> : null}
          {row.data.map((item, iIndex) => (
            <List.Item
              key={iIndex}
              title={item.options && item.options.headerTitle}
              style={currentItemClass({row}, {iIndex})}
              titleStyle={currentTitleClass({row})}
              left={item.left}
              right={() => (
                <List.Icon icon={require('@src/assets/svg/right.png')} />
              )}
              onPress={() => handlePress(item)}
            />
          ))}
        </List.Section>
      ))}
    </ScrollView>
  );
}

const style = StyleSheet.create({
  scrollView: {
    backgroundColor: '#F2F4F8',
  },
  divider: {
    marginLeft: 16,
  },
  section: {
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#fff',
  },
  defaultItem: {
    paddingLeft: Platform.OS === 'ios' ? 8 : 0,
    marginLeft: Platform.OS === 'ios' ? 0 : 8,
    height: Platform.OS === 'ios' ? 44 : 48,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Platform.OS === 'ios' ? '#fff' : 'transparent',
  },
  item: {},
  cityItem: {
    height: Platform.OS === 'ios' ? 44 : 68,
  },
  lastItem: {},
  title: {
    fontFamily: 'PTRootUI-Regular',
    fontSize: 17,
    color: Platform.OS === 'ios' ? GREY_90 : 'rgba(0, 0, 0, 0.87)',
  },
  cityTitle: {
    fontFamily: 'PTRootUI-Regular',
    fontSize: 17,
    color: ACCENT_50,
  },
  subheader: {
    fontFamily: 'PTRootUI-Regular',
    fontSize: 11,
    paddingTop: 24,
    color: GREY_50,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  caption: {
    ...typography('sm', 'regular'),
    color: GREY_50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#fff',
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 60 : 34,
  },
});

const itemStyle = StyleSheet.compose(style.item, style.defaultItem);

const cityItemStyle = StyleSheet.compose(style.cityItem, style.defaultItem);

const lastItemStyle = StyleSheet.compose(style.lastItem, style.defaultItem);
