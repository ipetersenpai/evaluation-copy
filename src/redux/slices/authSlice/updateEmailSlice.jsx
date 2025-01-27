import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../Axios/axios"
import { fetchUserInformation } from "../userSlice/userInfoSlice";
const initialState = {
  data: null,
  loading: false,
  error: null,
  status: null
};

export const AsyncUpdateEmail = createAsyncThunk(
  "user/AsyncUpdateEmail",
  async ({email, id}, {dispatch}) => {
    try {
      const response = await axios.post(`/users/update-email/${id}`, email);
      dispatch(fetchUserInformation({ id: id}))
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const updateEmailSlice = createSlice({
  name: "AsyncUpdateEmail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(AsyncUpdateEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = ""
      })
      .addCase(AsyncUpdateEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.status = "success"
      })
      .addCase(AsyncUpdateEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = "failed"
      });
  },
});

export default updateEmailSlice.reducer
