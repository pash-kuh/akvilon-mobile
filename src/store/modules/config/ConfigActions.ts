import RemoteConfig from '@react-native-firebase/remote-config';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getRemoteConfig = createAsyncThunk('config/get', async () => {
  await RemoteConfig().setConfigSettings({
    minimumFetchIntervalMillis: 5,
  });
  await RemoteConfig().setDefaults({
    base_url: 'stage.akvilon.kz',
  });
  await RemoteConfig().fetchAndActivate();
  const value = RemoteConfig().getValue('base_url').asString();
  if (value) {
    return value;
  } else {
    return 'stage.akvilon.kz';
  }
});
