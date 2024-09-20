import {createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '@src/helpers/request';

type Props = {
  url: string;
  token: string;
};

export const fetchFavorites = createAsyncThunk(
  'favorites',
  async ({url, token}: Props) => {
    try {
      const {
        data: {data},
      } = await api(url).get('/users/state/favorites/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);

type AddProps = {
  url: string;
  favoritesIds: string | string[];
  token: string;
};

export const fetchAddFavorites = createAsyncThunk(
  'add/favorites',
  async ({url, favoritesIds, token}: AddProps) => {
    try {
      const {
        data: {data},
      } = await api(url).post(
        '/products/favorites/',
        {
          products: favoritesIds,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);

type RemovePropds = {
  url: string;
  favoritesId: string;
  token: string;
};

export const fetchRemoveFavorites = createAsyncThunk(
  'remove/favorites',
  async ({url, favoritesId, token}: RemovePropds) => {
    try {
      const {
        data: {data},
      } = await api(url).delete('/products/favorites/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          'products[]': favoritesId,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);
