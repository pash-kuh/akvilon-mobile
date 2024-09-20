import {createSlice} from '@reduxjs/toolkit';
import {
  createBadReview,
  getReviewStatus,
  saveReviewStatus,
} from '@src/store/modules/review/ReviewActions';

export const reviewSlice = createSlice({
  name: 'review',
  initialState: {
    reviewStatus: '',
    status: undefined,
    loading: false,
  },
  reducers: {
    setStatus(state, {payload}) {
      state.status = payload;
    },
    setReviewStatus(state, {payload}) {
      state.reviewStatus = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createBadReview.pending, (state) => {
      state.loading = true;
      state.status = 'pending';
    });
    builder.addCase(createBadReview.fulfilled, (state) => {
      state.loading = false;
      state.status = 'fulfilled';
    });
    builder.addCase(createBadReview.rejected, (state) => {
      state.loading = false;
      state.status = 'rejected';
    });
    builder.addCase(saveReviewStatus.fulfilled, (state, action) => {
      state.reviewStatus = action.payload;
    });
    builder.addCase(getReviewStatus.fulfilled, (state, action) => {
      state.reviewStatus = action.payload;
    });
  },
});
export const {setStatus, setReviewStatus} = reviewSlice.actions;

export default reviewSlice.reducer;
