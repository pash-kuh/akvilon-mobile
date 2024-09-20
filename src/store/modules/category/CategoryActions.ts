import {createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '@src/helpers/request';

type Props = {
  url: string;
  id: string;
};

export const fetchCategories = createAsyncThunk(
  'categories',
  async ({url, id}: Props) => {
    try {
      const {
        data: {data},
      } = await api(url).get('/sections/popular/', {
        params: {
          cityId: id,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);
