import {createSlice} from '@reduxjs/toolkit';

export const tagsSlice = createSlice({
  name: 'tags',
  initialState: [],
  reducers: {
    setTags: (state, action) => {
      return (state = action.payload.splice(0, 15));
    },
  },
});

export const {setTags} = tagsSlice.actions;
export default tagsSlice.reducer;
