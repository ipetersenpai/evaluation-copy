import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import AddQuestion from "../../compnents/Superadmin/AddQuestion";
import UpdateQuestion from "../../compnents/Superadmin/UpdateQuestion";
import { fetchAllQuestions } from "../../redux/slices/questionSlice/getAllQuestionsSlice";
import { useDispatch, useSelector } from "react-redux";
import { deleteQuestion } from "../../redux/slices/questionSlice/deleteQuestionSlice";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { resetAddQuestionStatus } from "../../redux/slices/questionSlice/addQuestionSlice";
import { resetUpdateStatus } from "../../redux/slices/questionSlice/updateQuestionSlice";
import { resetDeleteQuestionStatus } from "../../redux/slices/questionSlice/deleteQuestionSlice";
import LoadingAnimation from "../../compnents/LoadingAnimation";
import close from "../../assets/close.png";
const QuestionScreen = ({ closeModal }) => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.getAllQuestion);
  const [isOpen, setIsOpen] = useState(false);
  const addQuestionStatus = useSelector((state) => state.addQuestion.status);
  const updateQuestionStatus = useSelector(
    (state) => state.updateQuestion.status
  );
  const deleteQuestionStatus = useSelector(
    (state) => state.deleteQuestion.status
  );
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedData, setSelectedData] = useState("");
  const openModalHandler = () => {
    setIsOpen(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteQuestion(id));
  };
  const closeModalHandler = () => {
    setIsOpen(false);
  };

  const handleUpdateModal = (value) => {
    setSelectedData(value);
    setOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
  };

  const filteredData =
    data?.questions?.filter((row) => {
      const searchFields = ["type", "question_description"];
      return searchFields?.some((field) =>
        (row[field] || "")
          .toLowerCase()
          .includes((searchQuery || "").toLowerCase())
      );
    }) || [];

  const column = [
    {
      field: "question_description",
      headerName: "Questions",
      minWidth: 300,
      flex: 1,
      border: "1px solid #000000",
    },
    {
      field: "type",
      headerName: "Question Type",
      minWidth: 300,
      flex: 1,
      border: "1px solid #000000",
    },
    {
      field: "delete",
      headerName: "ACTIONS",
      headerAlign: "center",
      sortable: false,
      width: 200,
      minWdith: 300,
      align: "right",
      renderCell: (params) => (
        <div className="flex justify-between gap-4 m-2 ">
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDelete(params?.row.id)}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleUpdateModal(params?.row)}
          >
            EDIT
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(fetchAllQuestions());
  }, [dispatch]);

  useEffect(() => {
    if (addQuestionStatus === "success") {
      toast.success("Successfully Added Question", {
        autoClose: 500,
        theme: "dark",
        pauseOnHover: false,
        closeOnClick: true,
      });
    }

    if (updateQuestionStatus === "success") {
      toast.success("Successfully Updated Question", {
        autoClose: 500,
        theme: "dark",
        pauseOnHover: false,
        closeOnClick: true,
      });
    }

    if (deleteQuestionStatus === "success") {
      toast.success("Successfully Deleted Question", {
        autoClose: 500,
        theme: "dark",
        pauseOnHover: false,
        closeOnClick: true,
      });
    }

    setTimeout(() => {
      dispatch(resetAddQuestionStatus());
      dispatch(resetUpdateStatus());
      dispatch(resetDeleteQuestionStatus());
    }, 1000);
  }, [addQuestionStatus, dispatch, updateQuestionStatus, deleteQuestionStatus]);

  return (
    <>
      {isOpen && <AddQuestion isOpen={isOpen} closeModal={closeModalHandler} />}
      {openUpdateModal && (
        <UpdateQuestion
          isOpen={openUpdateModal}
          selectedData={selectedData}
          closeModal={handleCloseUpdateModal}
        />
      )}
      <div className="fixed  py-0  px-5 tablet:px-0 min-h-screen max-h-screen w-full overflow-hidden backdrop-brightness-75">
        <div className="flex flex-col p-4 bg-white rounded-lg shadow-md border-[1px] mt-7 h-[90vh]">
          <img
            src={close}
            className="self-end cursor-pointer aspect-square w-10 mb-4"
            onClick={closeModal}
          />
          <div className="flex tablet:flex-row flex-col gap-4 tablet:gap-0 w-full justify-between mb-4 ">
            <div className="tablet:mt-0 w-full">
              <input
                type="text"
                placeholder="Questions & Question Type"
                className="desktop:w-[406px] tablet:w-[270px] w-full p-2 pl-10 border rounded-[360px] shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex justify-between">
              <Button
                variant="contained"
                disableElevation
                sx={{ minWidth: "150px", maxWidth: "200px" }}
                onClick={openModalHandler}
              >
                ADD QUESTION
              </Button>
            </div>
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
            {loading ? (
              <div className="flex justify-center border-2 w-full">
                <LoadingAnimation />
              </div>
            ) : (
              <>
                {" "}
                {filteredData?.length <= 0 ? (
                  <h1>No Data Available</h1>
                ) : (
                  <>
                    <DataGrid columns={column} rows={filteredData} />
                  </>
                )}
              </>
            )}
          </Box>
        </div>
        <ToastContainer pauseOnHover={false} />
      </div>
    </>
  );
};

export default QuestionScreen;
