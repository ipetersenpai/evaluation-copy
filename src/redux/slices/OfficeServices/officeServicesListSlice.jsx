// dataSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "../../../Axios/axios"
const initialState = {
  data: [],
  loading: false,
  error: null,
};

export const officeServicesList = createAsyncThunk(
  'service/officeServicesList',
  async () => {
   const response = await axios.get(`/get/office-services`)
   return response.data
  }
);

const officeServicesListSlice = createSlice({
  name: 'officeServicesList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(officeServicesList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(officeServicesList.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(officeServicesList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default officeServicesListSlice.reducer;
