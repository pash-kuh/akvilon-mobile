import {createSlice} from '@reduxjs/toolkit';
import {
  fetchCities,
  getActiveCity,
  setActiveCity,
} from '@src/store/modules/city/CityActions';
import {CityState} from '@src/store/modules/city/CityTypes';

export const citySlice = createSlice({
  name: 'city',
  initialState: {
    list: [],
    active: null,
    loading: false,
  } as CityState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCities.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCities.fulfilled, (state, action) => {
      state.list = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchCities.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(setActiveCity.fulfilled, (state, action) => {
      state.active = action.payload;
    });
    builder.addCase(getActiveCity.fulfilled, (state, action) => {
      state.active = action.payload;
    });
  },
});
export default citySlice.reducer;
