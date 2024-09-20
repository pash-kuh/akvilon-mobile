import {createSlice} from '@reduxjs/toolkit';

export const sliderSlice = createSlice({
  name: 'slider',
  initialState: [],
  reducers: {
    setSlider: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const {setSlider} = sliderSlice.actions;
export default sliderSlice.reducer;
