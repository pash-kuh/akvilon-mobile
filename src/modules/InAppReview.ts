import {Linking, Platform} from 'react-native';
/**
 * Модуль открытия страницы отзыва в браузере
 *
 * @category Module
 */
export default class InAppReview {
  static async RequestInAppReview() {
    const open = async (url) => {
      await Linking.openURL(url);
    };

    if (Platform.OS === 'android') {
      const url =
        'https://play.google.com/store/apps/details?id=com.akvilonmobile';
      await open(url);
    } else {
      const url =
        'https://apps.apple.com/ru/app/%D0%B0%D0%BA%D0%B2%D0%B8%D0%BB%D0%BE%D0%BD-%D1%82%D0%BE%D0%B2%D0%B0%D1%80%D1%8B-%D0%B4%D0%BB%D1%8F-%D0%B4%D0%BE%D0%BC%D0%B0/id1598130550';
      await open(url);
    }
  }
}
