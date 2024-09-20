import {createSlice} from '@reduxjs/toolkit';

export const bannersSlice = createSlice({
  name: 'banners',
  initialState: [],
  reducers: {
    setBanners(state, action) {
      return (state = action.payload);
    },
  },
});

export const {setBanners} = bannersSlice.actions;
export default bannersSlice.reducer;
