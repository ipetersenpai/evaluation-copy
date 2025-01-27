import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../Axios/axios";
import { fetchSession } from "./getSessionsSlice";
const initialState = {
  data: null,
  loading: false,
  error: null,
  status: "",
};

export const createSession = createAsyncThunk(
  "session/createSession",
  async (data, { dispatch }) => {
    try {
      const response = await axios.post("/school-year/create", data);
      dispatch(fetchSession())
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const createSessionsSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    resetSessionStatus(state){
        state.status = ""
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSession.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "";
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.status = "success";
      })
      .addCase(createSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = "fail";
      });
  },
});
export const { resetSessionStatus } = createSessionsSlice.actions;

export default createSessionsSlice.reducer;
