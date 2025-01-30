import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../Axios/axios"; // Assuming this axios is already set up with token

const initialState = {
  data: null,
  loading: false,
  error: null,
  status: null,
};

// Async action to update the user's password
export const AsyncChangeUserPassword = createAsyncThunk(
    "user/AsyncChangeUserPassword",
    async ({ id, newPassword }, { rejectWithValue }) => {
      try {

        const response = await axios.post(`/user/update-user-password/${id}`, {
          new_password: newPassword,
        });

        return response.data;
      } catch (error) {
        console.error("Error Response:", error.response?.data);
        return rejectWithValue(
          error.response?.data || { message: "An unexpected error occurred" }
        );
      }
    }
  );


const changeUserPasswordSlice = createSlice({
  name: "changeUserPassword",
  initialState,
  reducers: {
    resetChangeUserPasswordStatus(state) {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.status = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AsyncChangeUserPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(AsyncChangeUserPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.status = "success";
      })
      .addCase(AsyncChangeUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
        state.status = "failed";
      });
  },
});

export const { resetChangeUserPasswordStatus } = changeUserPasswordSlice.actions;

export default changeUserPasswordSlice.reducer;
