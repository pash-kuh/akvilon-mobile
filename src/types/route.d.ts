import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type ParamList = {
  Main: {
    MainPage: {isWebPage: boolean; route: string};
    MainPageScreen: {isWebPage: boolean; route: string};
    Catalog: {isWebPage: boolean; route: string};
    BrandsScreen: {route: string};
    CatalogFilterScreen: {isWebPage: boolean; route: string};
    CatalogMainScreen: {isWebPage: boolean; route: string};
    SearchMainScreen: {isWebPage: boolean; route: string};
    Search: {isWebPage: boolean; route: string};
    Cart: {isWebPage: boolean; route: string};
    CartMainScreen: {isWebPage: boolean; route: string};
    AdminScreen;
    SettingMainScreen;
    SettingPersonalClubcard;
    Settings: {
      isWebPage: boolean;
      SettingsPersonalData: {route: string};
      SettingsProfileScreen: {route: string};
      SettingsCityScreen: {route: string};
      SettingsReturnPurchase: {route: string};
      SettingsMainPersonal: {route: string};
      SettingsPersonalClubcard: {route: string};
      SettingsBrands: {route: string};
      SettingsMasterTipsDetail: {route: string};
      SettingsPrePayment: {route: string};
      SettingsAllInformation: {route: string};
      SettingsServices: {route: string};
      SettingsPayAndDelivery: {route: string};
      SettingsUnloadingAndLiftingRules: {route: string};
      SettingsJuristic: {route: string};
      SettingsCredit: {route: string};
      SettingsLoyalty: {route: string};
      SettingsAkvilonBonusCard: {route: string};
      SettingsChangeDiscountCard: {route: string};
      SettingsPurchaseReturn: {route: string};
      SettingsFAQ: {route: string};
      SettingsMasterTips: {route: string};
      SettingsCompany: {route: string};
      SettingsSuppliers: {route: string};
      SettingsVacancy: {route: string};
      SettingsContact: {route: string};
      SettingCalculator;
      SettingsMyOrder: {route: string};
      SettingsMyAddress: {route: string};
      SettingsHelpAppliancesOnCredit: {route: string};
      SettingsHelpPublicOffer: {route: string};
      SettingsMyData: {route: string};
      SettingsSignInSignUp: {
        SettingProfileSignSignIn: {
          type: string;
          route: string;
          onlyPhone: boolean;
          phone: string;
        };
        SettingProfileSignSignUp: {type: string; phone: string};
        SettingProfileSignMsg: {type: string; phone: string};
        SettingProfileSignSignInSMS: {type: string; phone: string};
        SettingProfileSignSignInOnyPhone: {
          phone: string;
          type: string;
          onlyPhone: boolean;
        };
      };
      SettingsMyBonusCard: {route: string};
      SettingsActiveCard: {route: string};
    };
  };
  City;
  Error: undefined;
  Loading: undefined;
  Auth: {type: string; route: string};
  FeedbackDrawer: undefined;
  QrCodeDrawer: undefined;
  Camera: {type: string; route: string};
  CameraNotFoundScreen: {type: string; route: string};
};

export type PL = ParamList &
  ParamList['Main'] &
  ParamList['Main']['MainPageScreen'] &
  ParamList['Main']['BrandsScreen'] &
  ParamList['Main']['MainPage'] &
  ParamList['Main']['Cart'] &
  ParamList['Main']['Search'] &
  ParamList['Main']['Catalog'] &
  ParamList['Main']['CatalogFilterScreen'] &
  ParamList['Main']['Settings'] &
  ParamList['Main']['Settings']['SettingMainScreen'] &
  ParamList['Main']['Settings']['SettingsSignInSignUp'];

export type NavigationProps<T extends keyof PL> = NativeStackScreenProps<PL, T>;
