// dataSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../../../Axios/axios"
const initialState = {
  data: [],
  loading: false,
  error: null,
  status : "idle"
};

export const getApprovedComments = createAsyncThunk(
  'comments/getApprovedComments',
  async ({id}) => {
   const response = await axios.get(`/list-approved/userid=${id}`)
   return response.data
  }
);

const getApprovedCommentSlice = createSlice({
  name: 'getApprovedComments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getApprovedComments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading"
      })
      .addCase(getApprovedComments.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.status = "success"
      })
      .addCase(getApprovedComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = "fail"
      });
  },
});

export default getApprovedCommentSlice.reducer;
