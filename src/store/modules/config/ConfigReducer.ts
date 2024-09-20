import { createSlice } from '@reduxjs/toolkit';
import { getRemoteConfig } from '@src/store/modules/config/ConfigActions';

export const configSlice = createSlice({
  name: 'config',
  initialState: {
    url: 'akvilon.kz',
    newAuth: {
      newAuth: '',
      test: '',
    },
    apiUrl: 'api.akvilon.kz/api/',
  },
  reducers: {
    setNewAuth(state, action) {
      state.newAuth = action.payload;
    },
    setApiUrl(state, action) {
      state.apiUrl = action.payload;
    },
    setUrl(state, action) {
      state.url = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getRemoteConfig.fulfilled, (state, action) => {
      state.url = action.payload;
    });
    builder.addCase(getRemoteConfig.rejected, (state) => {
      state.url = 'akvilon.kz';
    });
  },
});

export const { setNewAuth, setApiUrl, setUrl } = configSlice.actions;
export default configSlice.reducer;
