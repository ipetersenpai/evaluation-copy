 import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import JwtDecoder from "../compnents/JwtDecoder";
import FacultyEvaluation from "../compnents/Forms/FacultyEvaluation";
import StudentsEvaluation from "../compnents/Forms/StudentsEvaluation";
import ClassroomObservation from "../compnents/Forms/ClassroomObservation";
import AdministrationForm from "../compnents/Forms/AdministrationForm";
import NonTeaching from "../compnents/Forms/NonTeaching";
import EvaluationForCustomer from "../compnents/Forms/EvaluationForCustomer";

const EvaluationForm = () => {
  const userData = JwtDecoder().decodedToken;
  const role = userData ? userData?.role : "";
  const { type } = useParams();
  const navigate = useNavigate()

  // Function to check if a role is allowed for a certain type
  const isAllowed = (type, role) => {
    switch (type) {
      case "1":
        return role === "Student";
      case "2":
        return role === "Principal" || role === "Treasurer" || role ==="Registrar" || role === "Coordinator" || role === "Teacher";
      case "3":
        return role === "Principal";
      case "4":
        return role === "Principal" || role === "Treasurer" || role ==="Registrar" || role === "Coordinator";
      case "5":
        return role === "Principal" || role === "Treasurer" || role ==="Registrar" || role === "Coordinator" || role === "Non-Teaching";
      case "6":
        return role === "Student";
      default:
        return false;
    }
  };

  // Render appropriate form or NoLandingPage
  if (isAllowed(type, role)) {
    switch (type) {
      case "1":
        return <StudentsEvaluation />;
      case "2":
        return <FacultyEvaluation />;
      case "3":
        return <ClassroomObservation />;
      case "4":
        return <AdministrationForm />;
      case "5":
        return <NonTeaching />;
      case "6":
        return <EvaluationForCustomer />;
      default:
        return null;
    }
  } else {
    navigate(-1)
  }

};

export default EvaluationForm;
