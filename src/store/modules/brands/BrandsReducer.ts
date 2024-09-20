import {createSlice} from '@reduxjs/toolkit';
import {Brand} from './BrandsTypes';

export const brandsSlice = createSlice({
  name: 'brands',
  initialState: [] as Brand[],
  reducers: {
    setBrands(state, action) {
      state = [...state, ...action.payload];
    },
  },
});

export const {setBrands} = brandsSlice.actions;
export default brandsSlice.reducer;
