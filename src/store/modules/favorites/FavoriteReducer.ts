import {createSlice} from '@reduxjs/toolkit';
import {Favroties} from './FavoriteTypes';

export const favoriteSlice = createSlice({
  name: 'favorites',
  initialState: [] as Favroties,
  reducers: {
    setFavorite(state, action) {
      return (state = action.payload);
    },
    addFavorite(state, action) {
      return [...state, action.payload];
    },
    removeFavorite(state, action) {
      return (state = state.filter((item) => item.id !== action.payload));
    },
  },
});

export const {setFavorite, addFavorite, removeFavorite} = favoriteSlice.actions;
export default favoriteSlice.reducer;
