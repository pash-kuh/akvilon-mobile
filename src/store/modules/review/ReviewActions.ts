import {apiMobile} from '@src/helpers/request';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {version} from '@/app.json';
import {Platform} from 'react-native';
import {getBrand, getModel, getVersion} from 'react-native-device-info';
import {ReviewStatusType} from '@src/store/modules/review/ReviewTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  comment: string
  token: string
}

export const createBadReview = createAsyncThunk(
  'review/create',
  async ({comment, token}: Props) => {
    const data = await apiMobile.post(
      '/review/',
      {
        comment: comment,
        appInfo: {
          version: version,
        },
        deviceInfo: {
          os: Platform.OS === 'ios' ? 1 : 0,
          osVersion: getVersion(),
          brand: getBrand(),
          model: getModel(),
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
  },
);

export const saveReviewStatus = createAsyncThunk(
  'review/save',
  async (type: ReviewStatusType) => {
    await AsyncStorage.setItem('reviewStatus', type);
    return type;
  },
);

export const getReviewStatus = createAsyncThunk('review/get', async () => {
  return await AsyncStorage.getItem('reviewStatus');
});
