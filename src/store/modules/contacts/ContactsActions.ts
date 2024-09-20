import {createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '@src/helpers/request';

export const fetchContacts = createAsyncThunk(
  'get/contacts',
  async (payload: {url}) => {
    try {
      const {
        data: {data},
      } = await api(payload.url)('/contacts/');
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);
