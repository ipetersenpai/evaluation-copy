// dataSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../../../Axios/axios"
const initialState = {
  data: [],
  loading: false,
  error: null,
  status: "idle"
};

export const totalDoneEvaluation = createAsyncThunk(
  'evaluated/totalDoneEvaluation',
  async () => {
   const response = await axios.get(`/total/users-evaluated`)
   return response.data
  }
);

const totalDoneEvaluationSlice = createSlice({
  name: 'totalDoneEvaluation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(totalDoneEvaluation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading"
      })
      .addCase(totalDoneEvaluation.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.status = "success"

      })
      .addCase(totalDoneEvaluation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = "fail"

      });
  },
});

export default totalDoneEvaluationSlice.reducer;
