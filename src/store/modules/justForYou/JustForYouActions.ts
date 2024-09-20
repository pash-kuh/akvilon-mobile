import {createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '@src/helpers/request';

type Props = {
  url: string;
  id: string;
  ucCookie: string;
};

export const fetchJustForYou = createAsyncThunk(
  'justForYou',
  async ({url, id, ucCookie}: Props) => {
    const params = {cityId: id, uc: ucCookie};
    try {
      const {
        data: {data},
      } = await api(url).get('/recs/main/', {params});
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);
