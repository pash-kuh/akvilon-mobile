import {createSlice} from '@reduxjs/toolkit';

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartCount: 0,
  },
  reducers: {
    setCartCount(state, action) {
      state.cartCount = action.payload;
    },
  },
});
export const {setCartCount} = cartSlice.actions;
export default cartSlice.reducer;
