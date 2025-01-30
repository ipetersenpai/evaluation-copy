import React, { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import LoadingAnimation from "../compnents/LoadingAnimation";
import NotFoundLandingPage from "../compnents/NotFoundLandingPage";
const TeacherDashboard = lazy(() => import("../screen/TeacherDashboard"));
const AdminDashboard = lazy(() => import("../screen/AdminDashboard"));
const Settings = lazy(() => import("../screen/Settings"));
const SelectEvaluationType = lazy(() =>
  import("../screen/SelectEvaluationType")
);
const EvaluationForm = lazy(() => import("../screen/EvaluationForm"));
const ApproveComments = lazy(() => import("../screen/ApproveComments"));
const SuperAdminDashboard = lazy(() =>
  import("../screen/Superadmin/DashboardScreen")
);
const TopNavbar = lazy(() => import("../compnents/Superadmin/TopNavbar"));
const Sidebar = lazy(() => import("../compnents/Superadmin/Sidebar"));
const SessionScreen = lazy(() => import("../screen/Superadmin/SessionScreen"));
const QuestionScreen = lazy(() =>
  import("../screen/Superadmin/QuestionScreen")
);
import EvaluationReportScreen from "../screen/EvaluationReport";

const Protected = ({ role }) => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen w-screen">
          <LoadingAnimation />
        </div>
      }
    >
      <Routes>
        {(role === "Teacher" || role === "Non-Teaching") && (
          <>
            <Route path="/" element={<TeacherDashboard />} />
            <Route path="/evaluation-form/:type" element={<EvaluationForm />} />
            <Route path="/Settings" element={<Settings />} />
          </>
        )}

        {role === "SuperAdmin" && (
          <>
            <Route
              path="/"
              element={
                <>
                  <div className="flex bg-white min-h-[100vh]">
                    <TopNavbar />
                    <Sidebar />
                    <SuperAdminDashboard />
                  </div>
                </>
              }
            />
            <Route
              path="/session/schoolyear"
              element={
                <>
                  <div className="flex bg-white min-h-[100vh]">
                    <TopNavbar />
                    <Sidebar />
                    <SessionScreen />
                  </div>
                </>
              }
            />
            <Route
              path="/add-question"
              element={
                <>
                  <div className="flex bg-white min-h-[100vh]">
                    <TopNavbar />
                    <Sidebar />
                    <QuestionScreen />
                  </div>
                </>
              }
            />
          </>
        )}

        {(role === "Principal" ||
          role === "Treasurer" ||
          role === "Registrar" ||
          role === "Coordinator") && (
          <>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/evaluation-type" element={<SelectEvaluationType />} />
            <Route path="/evaluation-form/:type" element={<EvaluationForm />} />
            <Route path="/Settings" element={<Settings />} />
            <Route path="/evaluation-result" element={<EvaluationReportScreen />} />
          </>
        )}
        {role === "Student" && (
          <>
            <Route path="/" element={<Navigate to="evaluation-type" />} />
            <Route path="/evaluation-type" element={<SelectEvaluationType />} />
            <Route path="/evaluation-form/:type" element={<EvaluationForm />} />
            <Route path="/Settings" element={<Settings />} />
          </>
        )}

        {role === "SpecialAdmin" && (
          <>
            <Route path="/" element={<ApproveComments />} />
            <Route path="/Settings" element={<Settings />} />
          </>
        )}

        <Route path="*" element={<NotFoundLandingPage />} />


      </Routes>
    </Suspense>
  );
};

export default Protected;
