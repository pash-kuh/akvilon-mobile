import {DefaultTheme} from 'react-native-paper';
import {BRAND_RED_50, GREY_20} from '@src/assets/style/variable.style';

export default {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    error: BRAND_RED_50,
    primary: GREY_20,
  },
};
