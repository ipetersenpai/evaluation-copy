// dataSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../../../Axios/axios"
const initialState = {
  data: [],
  loading: false,
  error: null,
};

export const recentComment = createAsyncThunk(
  'comments/recentComment',
  async () => {
   const response = await axios.get(`/evaluation-form/recent-approved/comment-suggestion`)
   return response.data
  }
);

const recentCommentSlice = createSlice({
  name: 'recentComment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(recentComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(recentComment.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(recentComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default recentCommentSlice.reducer;
