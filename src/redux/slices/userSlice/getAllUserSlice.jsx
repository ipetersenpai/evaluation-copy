import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../Axios/axios";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const getAllUser = createAsyncThunk(
  "user/getAllUser",
  async () => {
    try {
      const response = await axios.get(`/get-user`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const getAllUserSlice = createSlice({
  name: "getAllUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAllUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getAllUserSlice.reducer;
