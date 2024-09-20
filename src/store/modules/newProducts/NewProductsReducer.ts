import {createSlice} from '@reduxjs/toolkit';

export const newProductsSlice = createSlice({
  name: 'newProducts',
  initialState: [],
  reducers: {
    setNewProducts: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const {setNewProducts} = newProductsSlice.actions;
export default newProductsSlice.reducer;
