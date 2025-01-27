import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../Axios/axios";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const getUserList = createAsyncThunk(
  "user/getUserList",
  async () => {
    try {
      const response = await axios.get(`/get-user/role=Teacher`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const getListOfUserSlice = createSlice({
  name: "userList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getListOfUserSlice.reducer;
