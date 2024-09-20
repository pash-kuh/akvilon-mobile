import {createSlice} from '@reduxjs/toolkit';

export const justForYouSlice = createSlice({
  name: 'justForYou',
  initialState: {
    name: '',
    products: [],
  },
  reducers: {
    setJustForYou(state, action) {
      return (state = action.payload);
    },
  },
});

export const {setJustForYou} = justForYouSlice.actions;
export default justForYouSlice.reducer;
