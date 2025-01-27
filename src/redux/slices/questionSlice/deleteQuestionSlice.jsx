import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../Axios/axios";
import { fetchAllQuestions } from "./getAllQuestionsSlice";
const initialState = {
  data: null,
  loading: false,
  error: null,
  status: "",
};

export const deleteQuestion = createAsyncThunk(
  "question/deleteQuestion",
  async (id, { dispatch }) => {
    try {
      const response = await axios.delete(`question/delete/${id}`);
      dispatch(fetchAllQuestions())
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const deleteQuestionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    resetDeleteQuestionStatus(state){
        state.status = ""
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "";
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.status = "success";
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = "fail";
      });
  },
});
export const { resetDeleteQuestionStatus } = deleteQuestionSlice.actions;

export default deleteQuestionSlice.reducer;
