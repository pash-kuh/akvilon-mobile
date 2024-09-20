import {createSlice} from '@reduxjs/toolkit';

export const selfServicesSlice = createSlice({
  name: 'selfService',
  initialState: null,
  reducers: {
    setSelfServices: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const {setSelfServices} = selfServicesSlice.actions;
export default selfServicesSlice.reducer;
