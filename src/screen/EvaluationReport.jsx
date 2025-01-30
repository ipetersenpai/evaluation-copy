import React, { useEffect, useState } from "react";
import Header from "../compnents/Header";
import { fetchEvaluations } from "../redux/slices/resultsSlice/getResultSlice";
import { fetchSession } from "../redux/slices/SessionSlice/getSessionsSlice";
import { getAllUser } from "../redux/slices/userSlice/getAllUserSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  MenuItem,
  Select,
  Button,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress,
  Tooltip,
  TextField,
  Box,
} from "@mui/material";
import { IoMdArrowBack } from "react-icons/io";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

const EvaluationReportScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [evaluationData, setEvaluationData] = useState(null); // Local state for fetched evaluations
  const [searchTerm, setSearchTerm] = useState(""); // State for the search bar

  // Safe access to Redux states
  const sessions = useSelector((state) => state.sessions?.data?.data || []);
  const allUser = useSelector((state) => state.allUser?.data?.data || []);
  const evaluations = useSelector((state) => state.evaluations?.data || []); // Fallback to empty array

  useEffect(() => {
    setLoading(true);
    dispatch(fetchSession());
    dispatch(getAllUser());
    setLoading(false);
  }, [dispatch]);

  const handleSearch = async () => {
    if (sessionId && userId) {
      setLoading(true);
      try {
        const response = await dispatch(
          fetchEvaluations({ sessionId, userId })
        );
        setEvaluationData(response.payload?.data || []); // Update local state
      } catch (error) {
        console.error("Error fetching evaluations:", error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please select both session and user.");
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const margin = 10; // Margin on both sides
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const usableWidth = pageWidth - margin * 2; // Usable width for text
    let yPosition = 10; // Initial vertical position

    if (!evaluationData || evaluationData.length === 0) {
      alert("No data to export");
      return;
    }

    // Title for the PDF
    doc.setFontSize(16);
    doc.text("Evaluation Report", margin, yPosition);
    yPosition += 10;

    // Evaluated Full Name
    const evaluatedName = evaluationData[0]?.evaluated_full_name || "unknown";
    doc.setFontSize(12);
    doc.text(`Evaluated Name: ${evaluatedName}`, margin, yPosition);
    yPosition += 10;

    // Iterate through evaluation data
    evaluationData.forEach((evaluation, index) => {
      doc.setFontSize(12);
      doc.text(
        `Evaluator: ${evaluation.evaluator_full_name}`,
        margin,
        yPosition
      );
      yPosition += 10;

      // Generate Table for Ratings
      const tableData = evaluation.ratings.map((rating) => [
        rating.question_description,
        rating.rating,
      ]);

      doc.autoTable({
        startY: yPosition,
        head: [["Question Description", "Rating"]],
        body: tableData,
        theme: "striped",
      });

      yPosition = doc.lastAutoTable.finalY + 10;

      // Add Comment and Suggestion with wrapping
      const comment = `Comment: ${evaluation.comment || "N/A"}`;
      const suggestion = `Suggestion: ${evaluation.suggestion || "N/A"}`;

      // Wrap the text within the usable width
      const wrappedComment = doc.splitTextToSize(comment, usableWidth);
      const wrappedSuggestion = doc.splitTextToSize(suggestion, usableWidth);

      // Check if there's enough space; if not, add a new page
      if (
        yPosition + wrappedComment.length * 10 + wrappedSuggestion.length * 10 >
        pageHeight - margin
      ) {
        doc.addPage();
        yPosition = margin; // Reset to top of the new page
      }

      doc.text(wrappedComment, margin, yPosition);
      yPosition += wrappedComment.length * 6; // Adjust yPosition dynamically

      doc.text(wrappedSuggestion, margin, yPosition);
      yPosition += wrappedSuggestion.length * 6 + 10; // Adjust for spacing between evaluations

      // Add a page if nearing the bottom of the current one
      if (yPosition + 20 > pageHeight) {
        doc.addPage();
        yPosition = margin;
      }
    });

    // Dynamically name the PDF using the evaluated name
    const pdfFileName = `${evaluatedName
      .replace(/\s+/g, "_")
      .toLowerCase()}.pdf`;

    // Save PDF
    doc.save(pdfFileName);
  };

  // Filter users based on the search term
  const filteredUsers = allUser.filter((user) =>
    `${user.first_name} ${user.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "question_description",
      headerName: "Question Description",
      flex: 1,
    },
    { field: "rating", headerName: "Rating", width: 100 },
  ];

  const rows = evaluationData
    ? evaluationData.flatMap((evaluation, index) =>
        evaluation.ratings.map((rating, ratingIndex) => ({
          id: `${index}-${ratingIndex}`,
          question_description: rating.question_description,
          rating: rating.rating,
        }))
      )
    : [];

  return (
    <>
      <Header />
      <div className="p-6">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center">
          <div
            onClick={() => {
              navigate("/");
            }}
            className="flex flex-row gap-2 text-[24px] text-blue-400 hover:text-blue-600 hover:cursor-pointer hover:underline  items-center"
          >
            <IoMdArrowBack />
            <span>Back to dashboard</span>
          </div>
          <h1 className="font-bold text-[27px]">EVALUATION RESULTS</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center justify-center">
          <div>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="session-label">Session</InputLabel>
              <Select
                labelId="session-label"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                label="Session"
                disabled={loading}
              >
                {sessions.map((session) => (
                  <MenuItem key={session.id} value={session.id}>
                    {session.school_year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="user-label">User</InputLabel>
              <Select
                labelId="user-label"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                label="User"
                disabled={loading}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 500,
                      width: 300,
                      mt: 1,
                    },
                  },
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                }}
                renderValue={() =>
                  allUser.find((user) => user.id === userId)?.first_name ||
                  "Select User"
                }
              >
                <Box
                  sx={{ px: 2, py: 1 }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search users (Long press the search bar)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Box>
                {filteredUsers.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.first_name} {user.last_name}
                  </MenuItem>
                ))}
                {filteredUsers.length === 0 && (
                  <Box sx={{ px: 2, py: 1, color: "gray" }}>No users found</Box>
                )}
              </Select>
            </FormControl>
          </div>

          <div>
            <Tooltip title="Click to search evaluations" arrow>
              <span>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSearch}
                  disabled={!sessionId || !userId || loading}
                  fullWidth
                  sx={{
                    height: "50px",
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="secondary" />
                  ) : (
                    "Search"
                  )}
                </Button>
              </span>
            </Tooltip>
          </div>
        </div>
      </div>

      {evaluationData && evaluationData.length > 0 && (
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Display Evaluated Full Name once */}
            <h3 className="text-[24px] font-bold mb-4 uppercase">
              Evaluated Name:{" "}
              <span className="text-blue-500 font-normal uppercase">
                {evaluationData[0]?.evaluated_full_name}
              </span>
            </h3>

            <Button
              variant="contained"
              color="secondary"
              onClick={generatePDF}
              sx={{ marginBottom: "20px" }}
            >
              Download PDF
            </Button>
          </div>

          {evaluationData.map((evaluation, index) => (
            <div key={index} className="mb-8 border rounded-lg shadow-lg p-6">
              <h3 className="text-[20px] font-bold mb-4 uppercase">
                Evaluator Full Name:{" "}
                <span className="text-blue-500 font-normal uppercase">
                  {evaluation.evaluator_full_name}
                </span>
              </h3>

              <div className="mb-4">
                <DataGrid
                  autoHeight
                  rows={evaluation.ratings.map((rating, i) => ({
                    id: i,
                    question_description: rating.question_description,
                    rating: rating.rating,
                  }))}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                />
              </div>
              <div className="mt-4">
                <p className="text-sm">
                  <strong>Comment:</strong> {evaluation.comment}
                </p>
                <p className="text-sm">
                  <strong>Suggestion:</strong> {evaluation.suggestion}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {evaluationData && evaluationData.length === 0 && (
        <div className="text-center mt-8">
          <p>No evaluation data available for the selected session and user.</p>
        </div>
      )}
    </>
  );
};

export default EvaluationReportScreen;
