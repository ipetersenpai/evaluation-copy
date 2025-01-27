// import React, { useEffect } from "react";
// import Box from "@mui/material/Box";
// import { DataGrid } from "@mui/x-data-grid";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchMasterList } from "../redux/slices/MasterList/masterListSlice";
// import Tooltip from '@mui/material/Tooltip';

// // Function to generate field mapping dynamically
// const generateFieldMapping = (data) => {
//   if (!data || data.length === 0) return {};
//   const firstItem = data[0];
//   const fieldMapping = {};
//   let index = 1;

//   Object.keys(firstItem).forEach(key => {
//     if (key !== "Evaluated_full_name") {
//       fieldMapping[key] = `Q${index}`;
//       index++;
//     }
//   });

//   return fieldMapping;
// };

// // Function to transform data using field mapping
// const transformData = (data, fieldMapping) => {
//   return data.map(item => {
//     const newItem = {};
//     for (const [longName, shortName] of Object.entries(fieldMapping)) {
//       newItem[shortName] = item[longName];
//     }
//     newItem.evaluated_name = item.Evaluated_full_name;
//     return newItem;
//   });
// };

// // Function to filter out rows with undefined or null values
// const filterDefinedData = (data) => {
//   return data.filter(item => 
//     Object.values(item).every(value => value !== undefined && value !== null)
//   );
// };

// export default function OverallRatingTable({type}) {
//   const dispatch = useDispatch();

//   // Selectors
//   const masterlistData = useSelector((state) => state.masterList.data.data);

//   useEffect(() => {
//     dispatch(fetchMasterList({ type }));
//   }, [dispatch, type]);

//   // Generate field mapping dynamically
//   const fieldMapping = generateFieldMapping(masterlistData);
//   // Transform data using the generated field mapping
//   const transformedData = masterlistData ? transformData(masterlistData, fieldMapping) : [];
//   // Filter out rows with undefined or null values
//   const filteredData = filterDefinedData(transformedData);
//   console.log(filteredData);

//   // Create columns dynamically
//   const columns = [
//     {
//       field: "evaluated_name",
//       headerName: "Name",
//       sortable: false,
//       flex:1,
      
//       editable: true,
//       headerClassName: "sticky-header",
//     },
//     {
//       field: "",
//       headerName: "Overall Rating",
//       sortable: false,
//       flex:1,
//       editable: true,
//       headerClassName: "sticky-header",
//     },
//   ];

//   return (
//     <Box
//       sx={{
//         height: "400px",
//         width: "100%",
//         maxWidth: "100%",
//         maxHeight: "600px",
//       }}
//     >
//       <DataGrid
//         // rows={filteredData}
//         columns={columns}
//         getRowId={(row) => row.evaluated_id}
//         pageSizeOptions={[5]}
//         disableRowSelectionOnClick
//         rowHeight={40}
//       />
//     </Box>
//   );
// }
