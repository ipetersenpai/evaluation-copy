import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../Axios/axios"

const initialState = {
  data: null,
  loading: false,
  error: null,
  status: null
};

export const AsyncChangePassword = createAsyncThunk(
  "user/AsyncChangePassword",
  async ({credentials, id}) => {
    try {
      const response = await axios.post(`/user/update-password/${id}`, credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const changePasswordSlice = createSlice({
  name: "AsyncChangePassword",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(AsyncChangePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = ""
      })
      .addCase(AsyncChangePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.status = "success"
      })
      .addCase(AsyncChangePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = "failed"
      });
  },
});

export default changePasswordSlice.reducer
