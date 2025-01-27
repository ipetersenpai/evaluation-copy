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

export const approveIndividual = createAsyncThunk(
  "comments/approveAll",
  async (id, { dispatch }) => {
    try {
      const response = await axios.post(`/evaluation-form/approve/${id}`);
      dispatch(fetchComments())
      dispatch(recentComment())
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const individualApprovedSlice = createSlice({
  name: "approveIndividual",
  initialState,
  reducers: {
    resetStatusForIndividual(state) {
      state.status = ""; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(approveIndividual.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "";
      })
      .addCase(approveIndividual.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.status = "success";
      })
      .addCase(approveIndividual.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = "fail";
      });
  },
});

export const { resetStatusForIndividual } = individualApprovedSlice.actions;
export default individualApprovedSlice.reducer;
