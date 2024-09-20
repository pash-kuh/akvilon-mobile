import {createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '@src/helpers/request';

type Props = {
  url: string;
  id: string;
};

export const fetchImageSliderInfo = createAsyncThunk(
  'imageSliderInfo/get',
  async ({url, id}: Props) => {
    try {
      const {
        data: {data},
      } = await api(url).get('slider/', {
        params: {
          city: id,
          type: 'main',
        },
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },
);
