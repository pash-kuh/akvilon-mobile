import RemoteConfig from '@react-native-firebase/remote-config';
import {createAsyncThunk} from '@reduxjs/toolkit';

export const getRemoteConfig = createAsyncThunk('config/get', async () => {
  await RemoteConfig().setConfigSettings({
    minimumFetchIntervalMillis: 5,
  });
  await RemoteConfig().setDefaults({
    base_url: 'akvilon-6263.akvilon.ratio-dev.ru/',
  });
  await RemoteConfig().fetchAndActivate();
  const value = RemoteConfig().getValue('base_url').asString();
  if (value) {
    return value;
  } else {
    return 'akvilon-6263.akvilon.ratio-dev.ru/';
  }
});
