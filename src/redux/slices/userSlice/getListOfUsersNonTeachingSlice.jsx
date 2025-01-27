import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../Axios/axios";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const getUserNonTeachingList = createAsyncThunk(
  "user/getUserNonTeachingList",
  async () => {
    try {
      const response = await axios.get(`/get-user/role=Non-Teaching`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const getListOfUsersNonTeachingSlice = createSlice({
  name: "userList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserNonTeachingList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserNonTeachingList.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getUserNonTeachingList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getListOfUsersNonTeachingSlice.reducer;
