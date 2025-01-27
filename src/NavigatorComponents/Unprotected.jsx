import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../screen/Login";
import NotFoundLandingPage from "../compnents/NotFoundLandingPage";
const Unprotected = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="*" element={<NotFoundLandingPage />} />

    </Routes>
  );
};

export default Unprotected;
