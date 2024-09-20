import {createSlice} from '@reduxjs/toolkit';

export const storiesSlice = createSlice({
  name: 'stories',
  initialState: [],
  reducers: {
    setStories: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const {setStories} = storiesSlice.actions;
export default storiesSlice.reducer;
