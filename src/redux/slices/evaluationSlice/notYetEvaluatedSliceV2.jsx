// dataSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../../../Axios/axios"
const initialState = {
  data: [],
  loading: false,
  error: null,
  status: "idle"
};

export const notYetEvaluatedV2 = createAsyncThunk(
  'evaluated/notYetEvaluatedV2',
  async () => {
   const response = await axios.get(`/not-yet-evaluate`)
   return response.data
  }
);

const notYetEvaluatedSliceV2 = createSlice({
  name: 'notYetEvaluatedV2',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(notYetEvaluatedV2.pending, (state) => {
        state.loading = true;
        state.status = "loading"
        state.error = null;
      })
      .addCase(notYetEvaluatedV2.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "success"
        state.data = action.payload;
      })
      .addCase(notYetEvaluatedV2.rejected, (state, action) => {
        state.loading = false;
        state.status = "fail"
        state.error = action.error.message;
      });
  },
});

export default notYetEvaluatedSliceV2.reducer;
