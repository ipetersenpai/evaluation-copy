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

export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async ({id, data}, { dispatch }) => {
    try {
      const response = await axios.post(`/evaluation-form/update/${id}`, data);
      dispatch(fetchComments())
      dispatch(recentComment())
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const updateCommentSlice = createSlice({
  name: "updateComment",
  initialState,
  reducers: {
    resetStatus(state) {
      state.status = ""; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "";
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.status = "success";
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = "fail";
      });
  },
});

export const { resetStatus } = updateCommentSlice.actions;
export default updateCommentSlice.reducer;
