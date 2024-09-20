import {createSlice} from '@reduxjs/toolkit';
import {CategoryItem} from './CategoryTypes';

export const categorySlice = createSlice({
  name: 'category',
  initialState: {
    popular: {
      list: [] as CategoryItem[],
    },
  },
  reducers: {
    setPopularCategories(state, action) {
      state.popular.list = action.payload;
    },
  },
});

export const {setPopularCategories} = categorySlice.actions;
export default categorySlice.reducer;
