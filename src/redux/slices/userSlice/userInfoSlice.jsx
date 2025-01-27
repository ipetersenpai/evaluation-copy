import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../Axios/axios";

const initialState = {
  data: null,
  loading: false,
  error: null,
  status: "idle"
};

export const fetchUserInformation = createAsyncThunk(
  "userInformation/fetchUserInformation",
  async ({id}) => {
    try {
      const response = await axios.get(`/user/profile/userId=${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInformation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading"
      })
      .addCase(fetchUserInformation.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.status = "success"

      })
      .addCase(fetchUserInformation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = "fail"

      });
  },
});

export default userInfoSlice.reducer;
