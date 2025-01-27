import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../Axios/axios"

const initialState = {
  data: null,
  error: null,
  status: "idle"
};

export const AsyncForgotPassword = createAsyncThunk(
  "user/AsyncForgotPassword",
  async (email) => {
      const response = await axios.post(`/user/reset-password`, email);
      return response.data;
  }
);

const forgotPasswordSlice = createSlice({
  name: "AsyncForgotPassword",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(AsyncForgotPassword.pending, (state) => {
        state.status = "loading"
        state.error = ""
      })
      .addCase(AsyncForgotPassword.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "success"
      })
      .addCase(AsyncForgotPassword.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "fail"
      });
  },
});

export default forgotPasswordSlice.reducer
