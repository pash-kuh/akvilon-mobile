import {createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '@src/helpers/request';

export const fetchBanners = createAsyncThunk('banners', async (url: string) => {
  try {
    const {
      data: {data},
    } = await api(url).get('/banner/main/');
    return data;
  } catch (error) {
    console.log(error);
  }
});
