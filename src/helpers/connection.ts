import {fetch} from '@react-native-community/netinfo';

export const checkConnection = async () => {
  const state = await fetch();
  return state.isConnected;
};
