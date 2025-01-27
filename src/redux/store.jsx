import { configureStore } from "@reduxjs/toolkit";

import loginReducer from "./slices/authSlice/loginSlice";
import changePasswordReducer from "./slices/authSlice/changePasswordSlice";
import updateEmailReducer from "./slices/authSlice/updateEmailSlice";
import forgotPasswordReducer from "./slices/authSlice/forgotPasswordSlice";
import getQuestionsReducer from "./slices/questionSlice/getQuestionsSlice";
import evaluateReducer from "./slices/evaluationSlice/evaluateSlice";
import userInfoReducer from "../redux/slices/userSlice/userInfoSlice";
import updateInfoReducer from "../redux/slices/userSlice/updateInfoSlice"
import getListOfUsersReducer from "./slices/userSlice/getListOfUsersSlice";
import getListOfUserAdminReducer from "../redux/slices/userSlice/getListOfUsersAdminSlice"
import getListOfUserNonTeaching from "../redux/slices/userSlice/getListOfUsersNonTeachingSlice"
import addQuestionReducer from "./slices/questionSlice/addQuestionSlice";
import getSessionsReducer from "./slices/SessionSlice/getSessionsSlice";
import createSessionsReducer from "./slices/SessionSlice/createSessionsSlice";
import getAllUserReducer from "./slices/userSlice/getAllUserSlice";
import updateUserReducer from "./slices/SuperAdminUserSlice/updateUserSlice";
import deleteUserReducer from "./slices/SuperAdminUserSlice/deleteUserSlice";
import addUserReducer from "./slices/SuperAdminUserSlice/addUserSlice";
import getCommentReducer from "./slices/Comments/getCommentSlice";
import getAllQuestionsReducer from "./slices/questionSlice/getAllQuestionsSlice";
import deleteQuestionReducer from "./slices/questionSlice/deleteQuestionSlice";
import approvedAllReducer from "./slices/Comments/approvedAllSlice";
import updateCommentReducer from "./slices/Comments/updateCommentSlice";
import individualApprovedReducer from "./slices/Comments/individualApprovedSlice";
import notYetEvaluatedReducer from "./slices/evaluationSlice/notYetEvaluatedSlice";
import totalDoneEvaluatedReducer from "./slices/evaluationSlice/totalDoneEvaluatedSlice";
import getApprovedCommentsReducer from "./slices/Comments/getApprovedCommentsSlice";
import recentCommentReducer from "./slices/Comments/recentCommentSlice";
import officeServicesListReducer from "./slices/OfficeServices/officeServicesListSlice";
import updateQuestionReducer from "./slices/questionSlice/updateQuestionSlice";
import pieChartReducer from "./slices/Charts/pieChartSlice";
import BarchartReducer from "./slices/Charts/BarchartSlice";
import masterListReducer from "./slices/MasterList/masterListSlice";
import masterListSliceTeacherReducer from "./slices/MasterList/masterListSliceTeacher";

const store = configureStore({
  reducer: {
    userLogin: loginReducer,
    changePassword: changePasswordReducer,
    updateEmail: updateEmailReducer,
    forgotPassword: forgotPasswordReducer,
    getQuestions: getQuestionsReducer,
    evaluate: evaluateReducer,
    userInfo: userInfoReducer,
    updateInfo : updateInfoReducer,
    userList : getListOfUsersReducer,
    userAdmin: getListOfUserAdminReducer,
    userNonTeaching : getListOfUserNonTeaching,
    addQuestion : addQuestionReducer,
    sessions: getSessionsReducer,
    addSessions: createSessionsReducer,
    allUser: getAllUserReducer,
    updateUser: updateUserReducer,
    deleteUser: deleteUserReducer,
    addUser : addUserReducer,
    getComment: getCommentReducer,
    getAllQuestion : getAllQuestionsReducer,
    deleteQuestion : deleteQuestionReducer,
    approveAll : approvedAllReducer,
    updateComment : updateCommentReducer,
    approvedIndividually: individualApprovedReducer,
    notYetEvaluated: notYetEvaluatedReducer,
    totalDone : totalDoneEvaluatedReducer,
    getApprovedComments : getApprovedCommentsReducer,
    recentComment : recentCommentReducer,
    servicesList : officeServicesListReducer,
    updateQuestion: updateQuestionReducer,
    masterlist: masterListReducer,
    masterlistTeacher: masterListSliceTeacherReducer,
    pieChart : pieChartReducer,
    barChart : BarchartReducer,
  },
});

export default store;
