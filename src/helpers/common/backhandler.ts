import {Alert, BackHandler} from 'react-native';

export default (navigation) => {
  if (navigation.canGoBack()) {
    navigation.goBack();
  }
  return true;
};
