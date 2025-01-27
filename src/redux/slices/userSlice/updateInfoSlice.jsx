import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../Axios/axios";
import { fetchUserInformation } from "./userInfoSlice"; // Import fetchUserInformation from userInfoSlice

const initialState = {
  data: null,
  loading: false,
  error: null,
  status: "",
};

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async ({ value, id }, { dispatch }) => {
    try {
      const response = await axios.post(`/user/updateprofile/${id}`, value);
      dispatch(fetchUserInformation({ id: id }));

      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const updateInfoSlice = createSlice({
  name: "updateProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "";
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.status = "success";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = "fail";
      });
  },
});

export default updateInfoSlice.reducer;
