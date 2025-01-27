import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../Axios/axios";
import { fetchAllQuestions } from "./getAllQuestionsSlice";
const initialState = {
  data: null,
  loading: false,
  error: null,
  status: "",
};

export const addQuestion = createAsyncThunk(
  "question/addQuestion",
  async (data, { dispatch }) => {
    try {
      const response = await axios.post("/question/create", data);
      dispatch(fetchAllQuestions())
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const addQuestionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    resetAddQuestionStatus(state){
        state.status = ""
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "";
      })
      .addCase(addQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.status = "success";
      })
      .addCase(addQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.status = "fail";
      });
  },
});
export const { resetAddQuestionStatus } = addQuestionSlice.actions;

export default addQuestionSlice.reducer;
