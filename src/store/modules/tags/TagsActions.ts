import {createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '@src/helpers/request';

export const fetchTags = createAsyncThunk('tags/get', async (url: string) => {
  try {
    const {
      data: {data},
    } = await api(url).get('/tags/');
    return data;
  } catch (error) {
    console.log(error);
  }
});
