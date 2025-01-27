import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../Axios/axios";
import { getAllUser } from "../userSlice/getAllUserSlice";
const initialState = {
  data: null,
  loading: false,
  error: null,
  status: ""
};

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({value, id}, {dispatch}) => {
    try {
      const response = await axios.post(`/super-admin/update-details/userid=${id}`, value);
      dispatch(getAllUser())
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const updateUserSlice = createSlice({
  name: "updateUser",
  initialState,
  reducers: {
    resetStatus(state){
        state.status = ""
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.status = ""
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.status = 'success'
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = 'fail'
      });
  },
});

export const { resetStatus } = updateUserSlice.actions;

export default updateUserSlice.reducer
