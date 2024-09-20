import {createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '@src/helpers/request';

export const fetchBrands = createAsyncThunk('brands', async (url: string) => {
  try {
    const {
      data: {data},
    } = await api(url).get('/brands/');
    return data;
  } catch (error) {
    console.log(error);
  }
});
