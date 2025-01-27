// dataSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../../../Axios/axios"
const initialState = {
  data: [],
  loading: false,
  error: null,
};

export const barChart = createAsyncThunk(
  'chart/barChart',
  async (id) => {
   const response = await axios.get(`/rating-total?userid=${id}`)
   return response.data
  }
);

const barChartSlice = createSlice({
  name: 'barChart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(barChart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(barChart.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(barChart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default barChartSlice.reducer;
