import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../Axios/axios";

// Initial state for evaluations slice
const initialState = {
  data: null,
  loading: false,
  error: null,
  status: "",
};

// Async thunk for fetching evaluations
export const fetchEvaluations = createAsyncThunk(
  "getResult/fetchEvaluations",
  async ({ sessionId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/evaluations/user/${sessionId}/${userId}`);
      return response.data;
    } catch (error) {
      // Return a rejected promise for error handling
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Slice for evaluations
const getResultSlice = createSlice({
  name: "getResult",
  initialState,
  reducers: {
    resetEvaluationsStatus(state) {
      state.status = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvaluations.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "";
      })
      .addCase(fetchEvaluations.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.status = "success";
      })
      .addCase(fetchEvaluations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch evaluations.";
        state.status = "fail";
      });
  },
});

// Export actions and reducer
export const { resetEvaluationsStatus } = getResultSlice.actions;

export default getResultSlice.reducer;
