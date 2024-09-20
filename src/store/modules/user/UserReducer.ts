/* eslint-disable @typescript-eslint/no-explicit-any */
import {createSlice} from '@reduxjs/toolkit';
import {
  confirmUser,
  createUser,
  fetchUserInfo,
  fetchUserLoyaltyCard,
  getUserToken,
  loginByPassword,
  getVersionNumber,
  setUserToken,
  resendConfirmationUser,
  getAuthStatus,
  fetchUserLoyaltyQrCode,
} from '@src/store/modules/user/UserActions';
import {UserState} from '@src/store/modules/user/UserTypes';
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: '',
    phone: '',
    user: {},
    loyalty: {},
    loading: false,
    versionNumber: '',
    mobileOS: '',
    versionOS: '',
    currentVersionNumber: {
      vAndroid: '',
      viOS: '',
    },
    appOpen: false,
    updateModalOpen: {
      vAndroid: false,
      viOS: false,
    },
    confirmation: '',
  } as UserState,
  reducers: {
    setPhone(state, action) {
      state.phone = action.payload;
    },
    setVersionNumber(state, action) {
      state.versionNumber = action.payload;
    },
    setMobileOS(state, action) {
      state.mobileOS = action.payload;
    },
    setVersionOS(state, action) {
      state.versionOS = action.payload;
    },
    setConfirmation(state, action) {
      state.confirmation = action.payload;
    },
    setAppOpen(state, action) {
      state.appOpen = action.payload;
    },
    setUpdateModalOpen(state, action) {
      state.updateModalOpen = action.payload;
    },
    setLoyaltyNumber(state, action) {
      state.loyalty.number = action.payload;
    },
    setLoyalty(state) {
      state.loyalty = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserInfo.pending, (state, action) => {
      // state.loading = true;
    });
    builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
      state.user = action.payload;
      // state.loading = false;
    });
    builder.addCase(fetchUserInfo.rejected, (state, action) => {
      state.user = {};
      state.loading = false;
    });
    builder.addCase(getVersionNumber.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getVersionNumber.fulfilled, (state, action) => {
      state.currentVersionNumber = action.payload;
      state.loading = false;
    });
    builder.addCase(getVersionNumber.rejected, (state, action) => {
      state.currentVersionNumber = {
        vAndroid: '',
        viOS: '',
      };
      state.loading = false;
    });
    builder.addCase(getAuthStatus.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(fetchUserLoyaltyCard.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchUserLoyaltyCard.fulfilled, (state, action) => {
      state.loyalty = action.payload.find((item) => item.activated);
      state.loading = false;
    });
    builder.addCase(fetchUserLoyaltyCard.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(fetchUserLoyaltyQrCode.fulfilled, (state, action) => {
      if (action && action.payload !== undefined) {
        state.loyalty.qrCodeInfo = action.payload;
      }
    });
    builder.addCase(fetchUserLoyaltyQrCode.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(setUserToken.fulfilled, (state, action) => {
      state.token = action.payload;
      state.loading = false;
    });
    builder.addCase(getUserToken.fulfilled, (state, action) => {
      state.token = action.payload;
      state.loading = false;
    });
    builder.addCase(loginByPassword.fulfilled, (state, action) => {
      state.token = action.payload;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.confirmation = action.payload.data.confirmation;
      state.loading = false;
    });
    builder.addCase(confirmUser.fulfilled, (state, action) => {
      state.token = action.payload;
    });
    builder.addCase(resendConfirmationUser.fulfilled, (state, action) => {
      state.confirmation = action.payload;
    });
  },
});
export const {
  setPhone,
  setVersionNumber,
  setAppOpen,
  setUpdateModalOpen,
  setConfirmation,
  setVersionOS,
  setMobileOS,
  setLoyaltyNumber,
  setLoyalty,
} = userSlice.actions;
export default userSlice.reducer;
