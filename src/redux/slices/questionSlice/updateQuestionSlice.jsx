import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../Axios/axios";
import { fetchAllQuestions } from "./getAllQuestionsSlice";
const initialState = {
  data: null,
  loading: false,
  error: null,
  status: "",
};

export const updateQuestion = createAsyncThunk(
  "question/updateQuestion",
  async ({value, id}, { dispatch }) => {
    try {
      const response = await axios.post(`/question/update/${id}`, value);
      dispatch(fetchAllQuestions())
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const updateQuestionSlice = createSlice({
  name: "updateQuestion",
  initialState,
  reducers: {
    resetUpdateStatus(state){
        state.status = ""
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "";
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.status = "success";
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = "fail";
      });
  },
});
export const { resetUpdateStatus } = updateQuestionSlice.actions;

export default updateQuestionSlice.reducer;
