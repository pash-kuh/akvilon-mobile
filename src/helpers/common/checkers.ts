import AsyncStorage from '@react-native-async-storage/async-storage';
import {CityState} from '@src/store/modules/city/CityTypes';
import {groupUsers} from '@src/mock/settings/pages';

export const checkUserFirstLogin = async () => {
  const isAlreadyLaunched = await AsyncStorage.getItem('alreadyLaunched');
  if (!isAlreadyLaunched) {
    return 'Auth';
  }
  return 'MainPageScreen';
};

export const checkUserSelectCity = (city: string) => {
  if (!city) {
    return 'City';
  }
  return 'MainPageScreen';
};

export const checkOnGroupRoute = (route) => {
  if (
    groupUsers.some(
      (item) => item.initialParams.route === route.replace('redirect|', ''),
    )
  ) {
    return true;
  }
  return false;
};
