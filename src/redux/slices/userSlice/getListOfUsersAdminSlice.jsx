import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../Axios/axios";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const getUserAdminList = createAsyncThunk(
  "user/getUserAdminList",
  async () => {
    try {
      const response = await axios.get(`/get-user/role=Admin`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const getListOfUsersAdminSlice = createSlice({
  name: "userList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserAdminList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserAdminList.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getUserAdminList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getListOfUsersAdminSlice.reducer;
