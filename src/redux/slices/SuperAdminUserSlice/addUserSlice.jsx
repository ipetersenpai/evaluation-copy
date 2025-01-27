import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../Axios/axios";
import { getAllUser } from "../userSlice/getAllUserSlice";
const initialState = {
  data: null,
  loading: false,
  error: null,
  status: ""
};

export const addUser = createAsyncThunk(
  "user/addUser",
  async (value, {dispatch}) => {
    try {
      const response = await axios.post("/register", value);
      dispatch(getAllUser())
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const addUserSlice = createSlice({
  name: "addUser",
  initialState,
  reducers: {
    resetUserStatus(state){
      state.status = ""
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.status = ""
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.status = 'success'
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = 'fail'
      });
  },
});

export const { resetUserStatus } = addUserSlice.actions;


export default addUserSlice.reducer
