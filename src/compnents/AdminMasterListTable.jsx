import React, { useEffect, useMemo, useCallback } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import LoadingAnimation from "./LoadingAnimation";
import { getMasterList } from "../redux/slices/MasterList/masterListSlice";
import Tooltip from "@mui/material/Tooltip";

const AdminMasterListTable = React.memo(() => {
  const dispatch = useDispatch();

  // Selectors
  const masterlistData = useSelector((state) => state.masterlist.data.data);
  const masterlistStatus = useSelector((state) => state.masterlist.status);
    console.log(masterlistData)
  useEffect(() => {
    dispatch(getMasterList());
  }, [dispatch]);

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
        const averageOverallRating =
          evaluatedPerson.average_overall_rating_score;

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
          average_overall_rating: averageOverallRating,
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
        <h1 className="my-2 font-bold text-2xl">Admin Master List</h1>
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

export default AdminMasterListTable;
