import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../Axios/axios";

const initialState = {
  data: null,
  error: null,
  status: "idle"
};

export const AsyncLogin = createAsyncThunk(
  "user/AsyncLogin",
  async (credentials) => {
    try {
      const response = await axios.post("/login", credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const loginSlice = createSlice({
  name: "AsyncLogin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(AsyncLogin.pending, (state) => {
        state.error = null;
        state.status = "loading"
      })
      .addCase(AsyncLogin.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'success'
      })
      .addCase(AsyncLogin.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = 'fail'
      });
  },
});

export default loginSlice.reducer
