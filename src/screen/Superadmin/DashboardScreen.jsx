import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import CreateUser from "../../compnents/Superadmin/CreateUser";
import UpdateUser from "../../compnents/Superadmin/UpdateUser";
import DeleteModal from "../../compnents/Superadmin/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import { getAllUser } from "../../redux/slices/userSlice/getAllUserSlice";
import { resetStatus } from "../../redux/slices/SuperAdminUserSlice/updateUserSlice";
import { resetUserStatus } from "../../redux/slices/SuperAdminUserSlice/addUserSlice";
import { deleteUserStatus } from "../../redux/slices/SuperAdminUserSlice/deleteUserSlice";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const DashboardScreen = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch()
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const {data} = useSelector((state) => state.allUser)
  const updateStatus = useSelector((state) => state.updateUser.status)
  const createUserStatus = useSelector((state) => state.addUser.status)
  const deleteUserStatus = useSelector((state) => state.deleteUser.status)
  const user = data?.data
  const openModalHandler = () => {
    setIsOpen(true);
  };

  const closeModalHandler = () => {
    setIsOpen(false);
  };

  const updateModalHandler = (data) => {
    setUpdateOpen(true);
    setSelectedData(data);
  };

  const closeUpdateModalHandler = () => {
    setUpdateOpen(false);
  };

  const deleteModalHandler = (data) => {
    setDeleteOpen(true);
    setSelectedData(data);
  };

  const closeDeleteModalHandler = () => {
    setDeleteOpen(false);
  };

  const filteredData =
    user?.filter((row) => {
      const searchFields = ["first_name", "last_name", "username", "email"];
      return searchFields?.some((field) =>
        (row[field] || "")
          .toLowerCase()
          .includes((searchQuery || "").toLowerCase())
      );
    }) || [];

  const column = [
    {
      field: "id",
      headerName: "USER ID",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "first_name",
      headerName: "FIRST NAME",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "last_name",
      headerName: "LAST NAME",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "email",
      headerName: "EMAIL",
      flex: 1,
      minWidth: 250,
      renderCell: ({ row: { email } }) => {
        return (
          <div className="">
            {email === null ? <p>No Email Added</p> : email}
          </div>
        );
      },
    },
    {
      field: "email_status",
      headerName: "EMAIL STATUS",
      flex: 1,
      minWidth: 150,
      renderCell: ({ row: { email_status } }) => {
        return (
          <div className="">
            {email_status === 1 && <p>TRUE</p>}
            {email_status === 0 && <p>FALSE</p>}
          </div>
        );
      },
    },
    {
      field: "username",
      headerName: "USERNAME",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "role",
      headerName: "ROLE",
      flex: 1,
      minWidth: 170,
    },
    {
      field: "last_evaluated",
      headerName: "LAST EVALUATED",
      flex: 1,
      minWidth: 190,
      renderCell: ({ row: { last_evaluated } }) => {
        return (
          <div className="">
            {last_evaluated === null ? (
              <p>Not Evaluated Yet</p>
            ) : (
              last_evaluated
            )}
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
    {
      field: "actions",
      headerName: "ACTION",
      minWidth: 200,
      flex: 1,

      renderCell: (params) => (
        <div className="flex flex-row gap-4">
          <div
            className="bg-[#644AFF] p-1 rounded-sm flex items-center justify-center text-white cursor-pointer  hover:bg-[#422eb6] "
            onClick={() => {
              updateModalHandler(params.row);
            }}
          >
            UPDATE
          </div>
          <div
            className="bg-[#F13434] p-1 rounded-sm flex items-center justify-center text-white cursor-pointer  hover:bg-[#d22727]  "
            onClick={() => {
              deleteModalHandler(params.row.id);
            }}
          >
            DELETE
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(getAllUser());
  }, [dispatch]);

  useEffect(() => {
    if (updateStatus === "success") {
      toast.success("Successfully Updated", {
        autoClose: 500,
        theme: "dark",
        pauseOnHover: false,
        closeOnClick: true,
      });
    }

    if (createUserStatus === "success") {
      toast.success("Successfully Add User", {
        autoClose: 500,
        theme: "dark",
        pauseOnHover: false,
        closeOnClick: true,
      });
    }

    if (deleteUserStatus === "success") {
      toast.success("Successfully Remove User", {
        autoClose: 500,
        theme: "dark",
        pauseOnHover: false,
        closeOnClick: true,
      });
    }

    setTimeout(() => {
      dispatch(resetStatus());
      dispatch(resetUserStatus())
      dispatch(deleteUserStatus())
    }, 1000);
  }, [updateStatus, dispatch, createUserStatus, deleteUserStatus]);


  return (
    <>
      {isOpen && <CreateUser isOpen={isOpen} closeModal={closeModalHandler} />}
      {updateOpen && (
        <UpdateUser
          isOpen={updateOpen}
          closeModal={closeUpdateModalHandler}
          selectedData={selectedData}
        />
      )}
      {deleteOpen && (
        <DeleteModal
          isOpen={deleteOpen}
          closeModal={closeDeleteModalHandler}
          selectedData={selectedData}
        />
      )}
      <div className="relative tablet:mx-[20px] py-0 mt-10 px-5 tablet:px-0 w-full h-full overflow-x-hidden">
        <div className="flex flex-col p-4 bg-white rounded-lg shadow-md border-[1px] mt-7 h-[90vh]">
          <div className="flex tablet:flex-row flex-col gap-4 tablet:gap-0 w-full justify-between mb-4 ">
            <div className="tablet:mt-0 w-full">
              <input
                type="text"
                placeholder="Search by Name, Username and email"
                className="desktop:w-[406px] tablet:w-[270px] w-full p-2 pl-10 border rounded-[360px] shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button
              variant="contained"
              disableElevation
              sx={{ minWidth: "150px", maxWidth: "150px" }}
              onClick={openModalHandler}
            >
              CREATE USER
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
            {filteredData && filteredData?.length > 0 ? (
              <DataGrid columns={column} rows={filteredData} />
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

export default DashboardScreen;
