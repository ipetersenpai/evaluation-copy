import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../Axios/axios";
import { getAllUser } from "../userSlice/getAllUserSlice";
const initialState = {
  data: null,
  loading: false,
  error: null,
  status: ""
};

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async ({id}, {dispatch}) => {
    try {
      const response = await axios.delete(`/delete-user/id=${id}`);
      dispatch(getAllUser())
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const deleteUserSlice = createSlice({
  name: "deleteUser",
  initialState,
  reducers: {
    deleteUserStatus(state){
        state.status = ""
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.status = ""
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.status = 'success'
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = 'fail'
      });
  },
});

export const { deleteUserStatus } = deleteUserSlice.actions;

export default deleteUserSlice.reducer
