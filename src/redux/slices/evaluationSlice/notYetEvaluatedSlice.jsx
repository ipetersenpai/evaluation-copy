// dataSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../../../Axios/axios"
const initialState = {
  data: [],
  loading: false,
  error: null,
  status: "idle"
};

export const notYetEvaluated = createAsyncThunk(
  'evaluated/notYetEvaluated',
  async () => {
   const response = await axios.get(`/users/not-evaluated/status=1`)
   return response.data
  }
);

const notYetEvaluatedSlice = createSlice({
  name: 'notYetEvaluated',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(notYetEvaluated.pending, (state) => {
        state.loading = true;
        state.status = "loading"
        state.error = null;
      })
      .addCase(notYetEvaluated.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "success"
        state.data = action.payload;
      })
      .addCase(notYetEvaluated.rejected, (state, action) => {
        state.loading = false;
        state.status = "fail"
        state.error = action.error.message;
      });
  },
});

export default notYetEvaluatedSlice.reducer;
