// dataSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../Axios/axios";
const initialState = {
  data: [],
  status: "idle",
  error: null,
};

export const getTeacherMasterlist = createAsyncThunk(
  "masterList/getTeacherMasterlist",
  async () => {
    const response = await axios.get(`/evaluation/masterlist`);
    return response.data;
  }
);

const masterListSliceTeacher = createSlice({
  name: "masterListSliceTeacher",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTeacherMasterlist.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getTeacherMasterlist.fulfilled, (state, action) => {
        state.status = "success";
        state.data = action.payload;
      })
      .addCase(getTeacherMasterlist.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.error.message;
      });
  },
});

export default masterListSliceTeacher.reducer;
