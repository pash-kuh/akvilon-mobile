import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  LoyaltyItem,
  UserItem,
  UserState,
} from '@src/store/modules/user/UserTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {parsePhone} from '@src/helpers/common/parse';
import {setCookie} from '@src/helpers/webview/cookie';
import {apiMobile} from '@src/helpers/request';
import {api} from '@src/helpers/request';

export const fetchUserInfo = createAsyncThunk(
  'users/get',
  async (payload: {token: string; url: string}) => {
    try {
      const {
        data: {data},
      } = await api(payload.url).get('/users/', {
        headers: {
          Authorization: `Bearer ${payload.token}`,
        },
      });
      return data as UserItem;
    } catch (e) {
      return Promise.reject(e);
    }
  },
);

export const getVersionNumber = createAsyncThunk('version/get', async (url) => {
  try {
    const {
      data: {data},
    } = await apiMobile(url).get('version/');
    return data as UserState;
  } catch (e) {
    return Promise.reject(e);
  }
});

export const getAuthStatus = createAsyncThunk('authStatus/get', async (url) => {
  try {
    const {
      data: {data},
    } = await apiMobile(url).get('settings/');
    return data;
  } catch (e) {
    return Promise.reject(e);
  }
});

export const fetchUserLoyaltyCard = createAsyncThunk(
  'users/loyalty/get',
  async (payload: {token: string; url: string}) => {
    try {
      const {
        data: {data},
      } = await api(payload.url).get('/loyalty/info/cards/', {
        headers: {
          Authorization: `Bearer ${payload.token}`,
        },
      });
      return data as LoyaltyItem[];
    } catch (e) {
      console.error(e);
      return Promise.reject(e);
    }
  },
);

export const fetchUserLoyaltyQrCode = createAsyncThunk(
  'users/loyalty/qrcode/get',
  async (payload: {token: string; url: string}) => {
    try {
      const {
        data: {data},
      } = await api(payload.url).get('/loyalty/cart/qr-request/', {
        headers: {
          Authorization: `Bearer ${payload.token}`,
        },
      });
      return data as unknown;
    } catch (e) {
      console.error(e);
      return Promise.reject(e);
    }
  },
);

export const setUserToken = createAsyncThunk(
  'users/save',
  async (token: string) => {
    await AsyncStorage.setItem('token', token);
    return token;
  },
);

export const getUserToken = createAsyncThunk(
  'users/get_form_memory',
  async () => {
    return await AsyncStorage.getItem('token');
  },
);

export const loginByPassword = createAsyncThunk(
  'users/loginByPassword',
  async (payload: {
    username: string;
    password: string;
    url: string;
    newUrl: string;
  }) => {
    try {
      const {
        data: {token},
      } = await api(payload.newUrl).post('/security/login/', {
        password: payload.password,
        username: parsePhone(payload.username),
      });
      await setCookie(payload.url, {
        name: 'token',
        value: token,
      });
      return token;
    } catch (e) {
      return Promise.reject(e);
    }
  },
);

export const createUser = createAsyncThunk(
  'users/create',
  async (payload: {username: string; url: string}) => {
    try {
      const res = await api(payload.url).post('/security/registration/', {
        phone: payload.username,
        isSubscription: true,
      });
      return res.data;
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }
  },
);

export const confirmUser = createAsyncThunk(
  'users/confirm',
  async (payload: {sms: string; url: string}) => {
    try {
      const {
        data: {
          data: {token},
        },
      } = await api(payload.url).post(`/security/confirm/${payload.sms}/`);
      console.log(token);
      return token;
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }
  },
);

export const newConfirmUser = createAsyncThunk(
  'users/newConfirm',
  async (payload: {sms: string; confirmation: string; url: string}) => {
    try {
      const {
        data: {
          data: {token},
        },
      } = await api(payload.url).post(
        `/security/confirm/${payload.confirmation}/${payload.sms}/`,
      );
      return token;
    } catch (e) {
      console.log(e);
      if (e.toString().includes('400') || e.toString().includes('429')) {
        return Promise.reject(e.response.data.message);
      }
      return Promise.reject(e);
    }
  },
);

export const recoveryUser = createAsyncThunk(
  'users/recovery',
  async (payload: {username: string; url: string}) => {
    try {
      const res = await api(payload.url).post('/security/recovery/', {
        phone: parsePhone(payload.username),
      });
      return res.data;
    } catch (e) {
      if (e.response.data.message.includes('Пользователь')) {
        return Promise.reject(e.response.data.message);
      }
      return Promise.reject(e);
    }
  },
);

export const resendConfirmationUser = createAsyncThunk(
  'users/resend-confirmation',
  async (payload: {confirmation: string; url: string}) => {
    try {
      const {data} = await api(payload.url).post(
        `/security/resend-confirmation/${payload.confirmation}/`,
      );
      return data;
    } catch (e) {
      return Promise.reject(e);
    }
  },
);

export const fetchCallBack = createAsyncThunk(
  'user/callback',
  async (payload: {phone: string; cityId: string; url: string}) => {
    try {
      const {data} = await api(payload.url).post('/feedback/callback/', {
        phone: payload.phone,
        cityId: payload.cityId,
        theme: 'Приложение: обратный звонок',
        productId: '',
      });
      return data;
    } catch (e) {
      return Promise.reject(e);
    }
  },
);
