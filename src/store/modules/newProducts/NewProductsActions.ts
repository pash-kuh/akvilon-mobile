import {createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '@src/helpers/request';

type Props = {
  url: string;
  id: string;
};

export const fetchNewProducts = createAsyncThunk(
  'newProducts',
  async ({url, id}: Props) => {
    const params = {cityId: id};
    try {
      const {
        data: {data},
      } = await api(url).get('/products/new/', {params});
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);
