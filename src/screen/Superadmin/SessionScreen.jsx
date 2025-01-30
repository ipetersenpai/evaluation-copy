import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import CreateSession from "../../compnents/Superadmin/CreateSession";
import { useDispatch, useSelector } from "react-redux";
import { fetchSession } from "../../redux/slices/SessionSlice/getSessionsSlice";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { resetSessionStatus } from "../../redux/slices/SessionSlice/createSessionsSlice";

const SessionScreen = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.sessions);
  const sessionStatus = useSelector((state) => state.addSessions.status);

  const sessionData = data?.data;
  const openModalHandler = () => {
    setIsOpen(true);
  };

  const closeModalHandler = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    dispatch(fetchSession());
  }, [dispatch]);

  const column = [
    {
      field: "id",
      headerName: "SESSION ID",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "school_year",
      headerName: "SCHOOL YEAR",
      flex: 1,
      minWidth: 200,
    },

    {
      field: "session_status",
      headerName: "SESSION STATUS",
      flex: 1,
      minWidth: 150,
      renderCell: ({ row: { session_status } }) => {
        return (
          <div className="">
            {session_status === 1 && <p>TRUE</p>}
            {session_status === 0 && <p>FALSE</p>}
          </div>
        );
      },
    },
    {
      field: "created_at",
      headerName: "DATE CREATED",
      flex: 1,
      minWidth: 250,
    },

    {
      field: "updated_at",
      headerName: "DATE LAST UPDATED",
      flex: 1,
      minWidth: 250,
    },
  ];

  useEffect(() => {
    if (sessionStatus === "success") {
      toast.success("Successfully Created Session", {
        autoClose: 500,
        theme: "dark",
        pauseOnHover: false,
        closeOnClick: true,
      });
    }

    setTimeout(() => {
      dispatch(resetSessionStatus());
    }, 1000);
  }, [sessionStatus, dispatch]);

  return (
    <>
      {isOpen && (
        <CreateSession isOpen={isOpen} closeModal={closeModalHandler} />
      )}

      <div className="relative tablet:mx-[20px] py-0 mt-10 px-5 tablet:px-0 w-full h-full overflow-x-hidden">
        <div className="flex flex-col p-4 bg-white rounded-lg shadow-md border-[1px] mt-7 h-[90vh]">
          <span className="flex items-center bg-blue-100 text-blue-800 border border-blue-300 rounded-md p-3 text-sm font-medium mb-4">
            <svg
              className="w-5 h-5 text-blue-600 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M12 22a10 10 0 100-20 10 10 0 000 20z"
              />
            </svg>
            Every year, the evaluation consists of two sessions: the midyear
            evaluation (01) and the end-year evaluation (02).
          </span>

          <div className="flex tablet:flex-row flex-col gap-4 tablet:gap-0 w-full justify-between mb-4 ">
            <div className="tablet:mt-0 w-full">
              {/* <FiSearch
                size={20}
                className="absolute mt-[11px] right-50 font-black ml-3"
              /> */}
              <input
                type="text"
                placeholder="Search by School Year"
                className="laptop:w-[406px] tablet:w-[270px] w-full p-2 pl-10 border rounded-[360px] shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button
              variant="contained"
              disableElevation
              sx={{ minWidth: "160px" }}
              onClick={openModalHandler}
            >
              CREATE SESSION
            </Button>
          </div>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              width: "100%",
              height: "90vh",
              overflowX: "hidden",

              "& .MuiDataGrid-cell": {
                borderBottom: 1,
                borderRight: 1,
                borderColor: "#CFCFCF",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "white",
                borderBottom: 1,
                borderTop: 1,
                borderRadius: 0,
                borderColor: "#CFCFCF",
                fontWeight: "bold",
                color: "black",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: "white",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: 1,
                backgroundColor: "#white",
                color: "black",
                borderColor: "#CFCFCF",
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: "black !important",
              },
              "& .MuiDataGrid .MuiButton-text": {
                color: "white !important",
              },
            }}
          >
            {sessionData && sessionData.length > 0 ? (
              <DataGrid columns={column} rows={sessionData} />
            ) : (
              <p>No data available</p>
            )}
          </Box>
        </div>
        <ToastContainer pauseOnHover={false} />
      </div>
    </>
  );
};

export default SessionScreen;
