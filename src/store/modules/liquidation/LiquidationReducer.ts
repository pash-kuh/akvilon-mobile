import {createSlice} from '@reduxjs/toolkit';
import {LiquidationList} from './LiquidationTypes';

export const liquidationSlice = createSlice({
  name: 'liquidation',
  initialState: [] as LiquidationList,
  reducers: {
    setLiquidation: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const {setLiquidation} = liquidationSlice.actions;
export default liquidationSlice.reducer;
