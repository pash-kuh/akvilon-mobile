import analytics, {
  FirebaseAnalyticsTypes,
} from '@react-native-firebase/analytics';
import {ReactNativeFirebase} from '@react-native-firebase/app';
/**
 * Подключение аналитики Firebase
 *
 * @category Helper
 */
export class FireBaseAnalytics {
  analytics: ReactNativeFirebase.FirebaseModuleWithStatics<
    FirebaseAnalyticsTypes.Module,
    FirebaseAnalyticsTypes.Statics
  >;

  constructor() {
    this.analytics = analytics;
  }

  async init() {
    try {
      await this.analytics().logEvent('init');
      await this.analytics().logEvent('phoneCall');
    } catch (e) {
      console.error('initAnalytics: error');
      console.error(e);
    }
  }

  async logEvent(payload) {
    console.log('[analytics.ts] logEvent with payload: ', payload);
    await this.analytics().logEvent(payload);
  }
}
