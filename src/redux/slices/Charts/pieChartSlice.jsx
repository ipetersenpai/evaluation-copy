// dataSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../Axios/axios";
const initialState = {
  data: [],
  loading: false,
  error: null,
};

export const pieChart = createAsyncThunk(
  "chart/pieChart",
  async ({ id, type }) => {
    try {
      const response = await axios.get(
        `/question-description/rating-total/?type=${type}&userid=${id}`
        
      );
      return response.data;
    } catch (error) {
      console.log(error)
    }
  }
);

const pieChartSlice = createSlice({
  name: "pieChart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(pieChart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(pieChart.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(pieChart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default pieChartSlice.reducer;
