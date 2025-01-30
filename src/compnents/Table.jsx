import React, { useEffect, useMemo, useCallback } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import LoadingAnimation from "./LoadingAnimation";
import { getTeacherMasterlist } from "../redux/slices/MasterList/masterListSliceTeacher";
import Tooltip from "@mui/material/Tooltip";
import * as XLSX from "xlsx";
import { Button } from "@mui/material";
import { FaFileExcel } from "react-icons/fa";

const Table = React.memo(() => {
  const dispatch = useDispatch();

  // Selectors
  const masterlistData = useSelector(
    (state) => state.masterlistTeacher.data.data
  );
  const masterlistStatus = useSelector(
    (state) => state.masterlistTeacher.status
  );
  console.log(masterlistData);

  useEffect(() => {
    dispatch(getTeacherMasterlist());
  }, [dispatch]);

    const exportToExcel = () => {
      // Create a worksheet from rows
      const worksheet = XLSX.utils.json_to_sheet(rowsAndColumns.rows);

      // Create a new workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

      // Export the workbook to a file
      XLSX.writeFile(workbook, "teacher_master_list_record.xlsx");
    };


// Memoized function to prepare rows and columns for DataGrid
const rowsAndColumns = useMemo(() => {
  if (!masterlistData || Object.keys(masterlistData).length === 0) {
    return { rows: [], columns: [] };
  }

  // Prepare columns
  const columns = [
    {
      field: "evaluated_name",
      headerName: "Name",
      sortable: false,
      width: 150,
    },
    {
      field: "average_overall_rating",
      headerName: "Overall Rating",
      sortable: false,
      width: 150,
    },
  ];

  const rows = Object.keys(masterlistData)
    .map((evaluatedId, index) => {
      const evaluatedPerson = masterlistData[evaluatedId];

      if (!evaluatedPerson || !evaluatedPerson.results) {
        return null; // Skip if evaluatedPerson or results are undefined
      }

      const evaluatedName = evaluatedPerson.evaluated_name;
      const averageOverallRating = evaluatedPerson.average_overall_rating_score;

      // Add columns for each question
      if (index === 0) {
        // Only add columns once
        evaluatedPerson.results.forEach((result, idx) => {
          columns.push({
            field: `question_${idx + 1}`,
            headerName: `Q${idx + 1}`,
            sortable: false,
            flex: 1,
            minWidth: 70,
            maxWidth: 70,
            renderHeader: () => (
              <Tooltip title={result.question_description}>
                <span>Q{idx + 1}</span>
              </Tooltip>
            ),
          });
        });
      }

      // Add row for each evaluated person
      const row = {
        id: evaluatedId,
        evaluated_name: evaluatedName,
        average_overall_rating: averageOverallRating || "N/A", // Ensure a default value if undefined
      };

      evaluatedPerson.results.forEach((result, idx) => {
        row[`question_${idx + 1}`] = result.overall_rating_score;
      });

      return row;
    })
    .filter((row) => row !== null);

  return { rows, columns };
}, [masterlistData]);

// useCallback to memoize getRowId function
const getRowId = useCallback((row) => row.id, []);


  return (
    <div>
      <div className="flex flex-col justify-between md:flex-row mb-4 md:mb-0">
        <h1 className="my-2 font-bold text-2xl">Teacher Master List</h1>

        <Button
          variant="contained"
          color="primary"
          onClick={exportToExcel}
          style={{
            marginBottom: "5px",
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            padding: "5px 10px",
          }}
        >
          <FaFileExcel />
          Export to Excel
        </Button>



      </div>
      <div className="border-2 border-black"></div>
      <Box
        sx={{
          height: "100vh",
          width: "100%",
          maxWidth: "100%",
          overflow: "auto", // Adding scrollbars when content overflows
        }}
      >
        {masterlistStatus === "loading" && (
          <div className="flex absolute inset-0 justify-center items-center">
            <LoadingAnimation />
          </div>
        )}
        {masterlistStatus === "success" && (
          <DataGrid
            rows={rowsAndColumns.rows}
            columns={rowsAndColumns.columns}
            getRowId={getRowId}
            pageSizeOptions={[5]}
            disableSelectionOnClick
            rowHeight={40}
            pagination
          />
        )}
      </Box>
    </div>
  );
});

export default Table;
