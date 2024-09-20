import {createSlice} from '@reduxjs/toolkit';

export const mobileConfigSlice = createSlice({
  name: 'mobileConfig',
  initialState: {
    filterOpen: false,
  },
  reducers: {
    setFilterOpen(state, action) {
      state.filterOpen = action.payload;
    },
  },
});

export const {setFilterOpen} = mobileConfigSlice.actions;
export default mobileConfigSlice.reducer;
