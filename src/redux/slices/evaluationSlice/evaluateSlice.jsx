import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../Axios/axios";
import { getUserList } from "../userSlice/getListOfUsersSlice";
import { getUserAdminList } from "../userSlice/getListOfUsersAdminSlice";
import{ getUserNonTeachingList} from "../userSlice/getListOfUsersNonTeachingSlice"
import {officeServicesList} from "../OfficeServices/officeServicesListSlice"
const initialState = {
  data: null,
  loading: false,
  error: null,
  status: "idle",
};

export const evaluate = createAsyncThunk(
  "evaluation/evaluate",
  async (data, { dispatch }) => {
    try {
      const response = await axios.post("/evaluation-result/create", data);
        
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const evaluateSlice = createSlice({
  name: "evaluate",
  initialState,
  reducers: {
    resetStatus(state) {
      state.status = ""; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(evaluate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(evaluate.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.status = "success";
      })
      .addCase(evaluate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = "fail";
      });
  },
});

export const { resetStatus } = evaluateSlice.actions;
export default evaluateSlice.reducer;
