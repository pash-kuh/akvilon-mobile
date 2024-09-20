import { createAsyncThunk } from '@reduxjs/toolkit';
import { CityItem } from '@src/store/modules/city/CityTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@src/helpers/request';

export const fetchCities = createAsyncThunk(
  'geolocation/cities',
  async (payload: { url: string }) => {
    try {
      const {
        data: { data },
      } = await api(payload.url)('/geolocation/cities/');
      return data as CityItem[];
    } catch (error) {
      console.log(error);
    }
  },
);

export const setActiveCity = createAsyncThunk(
  'geolocation/setActiveCity',
  async (payload: CityItem) => {
    await AsyncStorage.setItem('pickedCity', payload.code);
    return payload.code;
  },
);

export const getActiveCity = createAsyncThunk(
  'geolocation/getActiveCity',
  async () => {
    return await AsyncStorage.getItem('pickedCity');
  },
);
