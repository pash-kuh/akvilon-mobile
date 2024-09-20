import CityScreen from '@src/screens/Main/SettingsScreen/SettingsCityScreen';
import BonusScreen from '@src/screens/Main/SettingsScreen/SettingsBonusScreen';
import EmptyScreen from '@src/screens/EmptyScreen';
import SignInScreen from '@src/screens/Main/SettingsScreen/SettingsProfileScreen/ProfileSignScreen/SignInScreen';
import SignUpScreen from '@src/screens/Main/SettingsScreen/SettingsProfileScreen/ProfileSignScreen/SignUpScreen';
import SignMsgScreen from '@src/screens/Main/SettingsScreen/SettingsProfileScreen/ProfileSignScreen/SignMsgScreen';
import {TouchableWithoutFeedback} from 'react-native';
import {Text} from 'react-native-paper';
import React from 'react';
import {typography} from '@src/assets/style/typography.style';
import {GREY_50} from '@src/assets/style/variable.style';

export const groupUsers = [
  {
    name: 'SettingCalculator',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Строительный калькулятор',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/calculator/',
    },
  },
  {
    name: 'SettingFavoriteScreen',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Избранное',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/favorites/',
    },
  },
  {
    name: 'SettingCompareScreen',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Сравнение',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/compare/',
    },
  },
  {
    name: 'SettingPrePayment',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Поиск и оплата',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/pre_payment/',
    },
  },
  {
    name: 'SettingHelp',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Общая информация',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/help/',
    },
  },
  {
    name: 'SettingHelpServices',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Услуги',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/help/services/',
    },
  },
  {
    name: 'SettingHelpPaymentAndShipping',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Оплата и доставка',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/help/payment-and-shipping/',
    },
  },
  {
    name: 'SettingBonus',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Программа лояльности',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/help/bonus/',
    },
  },
  {
    name: 'SettingHelpPublicOffer',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'О персональных данных',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/public-offer/',
    },
  },
  {
    name: 'SettingHelpUnloadingAndLiftingRules',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Разгрузка и подъем',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/help/unloading-and-lifting-rules/',
    },
  },
  {
    name: 'SettingHelpLegalEntity',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Юридическим лицам',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/help/legal-entity/',
    },
  },
  {
    name: 'SettingHelpAppliancesOnCredit',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Кредитование',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/help/appliances-on-credit/',
    },
  },
  //{
  //  name: 'SettingLoyalty',
  //  component: EmptyScreen,
  //  options: {
  //    headerShown: true,
  //    headerTitle: 'Программа лояльности',
  //    headerShadowVisible: false,
  //    isWebView: true,
  //  },
  //  initialParams: {
  //    route: '/help/bonus/',
  //  },
  //},
  {
    name: 'SettingHelpGiftCertificates',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Подарочная карта Аквилон',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/help/gift-certificates/',
    },
  },
  {
    name: 'SettingHelpBonus.pro',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'BONUS.PRO',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/help/bonus.pro/',
    },
  },
  {
    name: 'SettingHelpReturnConditions',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Возврат товара',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/help/return-conditions/',
    },
  },
  {
    name: 'SettingFAQ',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'FAQ',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/faq/',
    },
  },
  {
    name: 'SettingMasterTips',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Советы от мастеров',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/advice/',
    },
  },
];

export const groupAbout = [
  {
    name: 'SettingCompany',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Об Аквилоне',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/company/',
    },
  },
  {
    name: 'SettingSuppliers',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Поставщикам',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/company/suppliers/',
    },
  },
  {
    name: 'SettingVacancy',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Вакансии',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: 'https://hh.kz/employer/3173294',
    },
  },
];

export const groupContact = [
  {
    name: 'SettingContact',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Контакты',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/contacts/',
    },
  },
];

export const groupAuth = (isLoyalty = false) => [
  {
    name: 'SettingMyOrder',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Мои заказы',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/personal/orders/',
    },
  },
  {
    name: 'SettingMyAddress',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Мои адреса',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/personal/address/',
    },
  },
  ...(isLoyalty ? groupLoyalty : []),
  {
    name: 'SettingMyEstimates',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Мои сметы',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/personal/estimates/',
    },
  },
  {
    name: 'SettingMyData',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Личные данные',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/personal/private/',
    },
  },
];

export const groupNoAuth = [
  {
    name: 'SettingProfileSignSignIn',
    component: SignInScreen,
    options: {
      headerShown: true,
      headerTitle: 'Войти/Зарегистрироваться',
      headerShadowVisible: false,
      headerRight: (navigation) => (
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
      ),
      isWebView: false,
    },
    initialParams: {
      route: 'redirect|/empty/',
      onlyPhone: false,
    },
  },
];

export const groupLoyalty = [
  {
    name: 'SettingMyBonusCard',
    component: BonusScreen,
    options: {
      headerShown: true,
      headerTitle: 'Моя карта АКВИЛОН.BONUS',
      headerShadowVisible: false,
      isWebView: false,
    },
    initialParams: {
      route: 'redirect|/empty/',
    },
  },
];

export const groupNoLoyalty = [
  {
    name: 'SettingActiveCard',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Моя карта АКВИЛОН.BONUS',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/activate/',
    },
  },
];

export const groupNoAuthNoLoyalty = [
  {
    name: 'SettingNoAuthActiveCard',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Карта АКВИЛОН.BONUS',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/activate/',
    },
  },
];

export const sections = [
  {
    name: 'SettingHelpLoyal',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Как накопить баллы?',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: 'redirect|/help/loyal/',
    },
  },
  {
    name: 'SettingCityScreen',
    component: CityScreen,
    options: {
      headerShown: true,
      headerTitle: 'Выбрать город',
      headerShadowVisible: false,
      isWebView: false,
    },
    initialParams: {
      route: 'redirect|/empty/',
    },
  },
  {
    name: 'SettingReturnPurchase',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Возврат товара',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/help/return-conditions/',
    },
  },
  {
    name: 'SettingMainPersonal',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Личный кабинет',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/personal/index/',
    },
  },
  {
    name: 'SettingPersonalClubcard',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Моя карта АКВИЛОН.BОNUS',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/personal/clubcard/?fullContentVisible=1',
    },
  },
  {
    name: 'SettingBrands',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: null,
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/brands/_id/',
    },
  },
  {
    name: 'SettingMasterTipsDetail',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: null,
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/advice/_id/',
    },
  },
  {
    name: 'SettingPersonalData',
    component: EmptyScreen,
    options: {
      headerShown: true,
      headerTitle: 'Соглашение об обработке персональных данных',
      headerShadowVisible: false,
      isWebView: true,
    },
    initialParams: {
      route: '/include/licenses_detail/',
    },
  },
  {
    name: 'SettingProfileSignSignUp',
    component: SignUpScreen,
    options: {
      headerShown: true,
      headerTitle: 'Создать аккаунт',
      headerShadowVisible: false,
      isWebView: false,
    },
    initialParams: {
      route: '',
    },
  },
  {
    name: 'SettingProfileSignMsg',
    component: SignMsgScreen,
    options: {
      headerShown: true,
      headerTitle: 'Создать аккаунт',
      headerShadowVisible: false,
      isWebView: false,
    },
    initialParams: {
      route: '',
    },
  },
  {
    name: 'SettingProfileSignSignInOnyPhone',
    component: SignInScreen,
    options: {
      headerShown: true,
      headerTitle: '',
      headerShadowVisible: false,
      isWebView: false,
      headerRight: () => null,
    },
    initialParams: {
      route: '',
      onlyPhone: true,
    },
  },
  {
    name: 'SettingProfileSignSignInSMS',
    component: SignMsgScreen,
    options: {
      headerShown: true,
      headerTitle: 'Продолжить без входа',
      headerShadowVisible: false,
      isWebView: false,
    },
    initialParams: {
      route: '',
    },
  },
  ...groupAuth(),
  ...groupUsers,
  ...groupAbout,
  ...groupNoAuth,
  ...groupNoLoyalty,
  ...groupNoAuthNoLoyalty,
  ...groupLoyalty,
  ...groupContact,
];
