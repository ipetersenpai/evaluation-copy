import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../Axios/axios";
import { fetchComments } from "./getCommentSlice";
import { recentComment } from "./recentCommentSlice";
const initialState = {
  data: null,
  loading: false,
  error: null,
  status: "",
};

export const approveAll = createAsyncThunk(
  "comments/approveAll",
  async (_, { dispatch }) => {
    try {
      const response = await axios.post("/evaluation-form/approve/all");
      dispatch(fetchComments())
      dispatch(recentComment())
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const approveAllSlice = createSlice({
  name: "approveAll",
  initialState,
  reducers: {
    resetApproveAllStatus(state) {
      state.status = ""; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(approveAll.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "";
      })
      .addCase(approveAll.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.status = "success";
      })
      .addCase(approveAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = "fail";
      });
  },
});

export const { resetApproveAllStatus } = approveAllSlice.actions;
export default approveAllSlice.reducer;
