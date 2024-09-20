import {createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '@src/helpers/request';

type Props = {
  url: string;
  id: string;
};

export const fetchProducts = createAsyncThunk(
  'products',
  async ({url, id}: Props) => {
    try {
      const {
        data: {data},
      } = await api(url).get('/recent/', {
        params: {
          city: id || '',
          limit: 24,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);
