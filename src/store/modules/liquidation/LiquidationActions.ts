import {createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '@src/helpers/request';

type Props = {
  url: string;
  id: string;
};

export const fetchLiquidationInfo = createAsyncThunk(
  'liquidationInfo/get',
  async ({url, id}: Props) => {
    try {
      const {
        data: {data},
      } = await api(url).get('/products/liquidation/', {
        params: {
          cityId: id,
          size: 20,
        },
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  },
);
