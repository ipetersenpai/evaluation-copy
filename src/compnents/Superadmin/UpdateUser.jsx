import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { IconButton } from "@mui/material";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useForm } from "react-hook-form";
import { updateUser } from "../../redux/slices/SuperAdminUserSlice/updateUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { resetStatus } from "../../redux/slices/SuperAdminUserSlice/updateUserSlice";

const UpdateUser = ({ isOpen, closeModal, selectedData }) => {
  const [selectedRole, setSelectedRole] = useState(false);
  const [selectedEmailStatus, setSelectedEmailStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch()
  
  const {status} = useSelector((state) => state.updateUser)
 
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();


  const onSubmitHandler = (data) => {
    dispatch(updateUser({value: data, id: selectedData?.id}))
  };

  useEffect(() => {
    if (status === "success") {
      reset();
      closeModal();
    }

    setTimeout(() => {
      dispatch(resetStatus());
    }, 1000);
  }, [status, dispatch]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          aria-modal="true"
        >
          <div className="flex justify-center pt-10 min-h-screen">
            <div
              className="bg-black bg-opacity-30 absolute inset-0"
              onClick={closeModal}
              tabIndex="-1"
              aria-hidden="true"
            ></div>
            <div className="absolute bg-white rounded-lg p-6 tablet:w-full w-[90%] max-w-lg shadow-xl">
              <div className="modal-content">
                <div className="flex flex-row w-full justify-between items-center">
                  <h5
                    className="modal-title text-xl font-bold"
                    id="modal-title"
                  >
                    UPDATE USER DETAILS
                  </h5>

                  <IconButton
                    sx={{ marginTop: "-0.5rem" }}
                    onClick={closeModal}
                  >
                    {/* <IoCloseSharp className="text-[28px] text-black" /> */}
                  </IconButton>
                </div>

                <div className="flex flex-col w-full mt-5">
                  <form onSubmit={handleSubmit(onSubmitHandler)}>
                    <TextField
                      fullWidth
                      sx={{
                        marginBottom: "15px",
                      }}
                      label="First Name"
                      name="first_name"
                      defaultValue={selectedData.first_name}
                      error={errors.first_name ? true : false}
                      {...register("first_name", {
                        required: "This is required",
                        pattern: {
                          value: /^[a-z ,.'-]+$/i,
                          message: "Invalid characters in name.",
                        },
                      })}
                    />
                    {errors.first_name && (
                      <p className="text-sm text-red w-full mt-[-0.6rem] mb-2 ml-1">
                        {errors.first_name.message}
                      </p>
                    )}
                    <TextField
                      fullWidth
                      sx={{
                        marginBottom: "15px",
                      }}
                      label="Last Name"
                      name="last_name"
                      defaultValue={selectedData.last_name}
                      error={errors.last_name ? true : false}
                      {...register("last_name", {
                        required: "This is required",
                        pattern: {
                          value: /^[a-z ,.'-]+$/i,
                          message: "Invalid characters in name.",
                        },
                      })}
                    />
                    {errors.last_name && (
                      <p className="text-sm text-red w-full mt-[-0.6rem] mb-2 ml-1">
                        {errors.last_name.message}
                      </p>
                    )}
                    <TextField
                      fullWidth
                      sx={{
                        marginBottom: "15px",
                      }}
                      label="Username"
                      name="username"
                      defaultValue={selectedData.username}
                      error={errors.username ? true : false}
                      {...register("username", {
                        required: "This is required",
                      })}
                    />
                    {errors.username && (
                      <p className="text-sm text-red w-full mt-[-0.6rem] mb-2 ml-1">
                        {errors.username.message}
                      </p>
                    )}
                    <TextField
                      fullWidth
                      sx={{
                        marginBottom: "15px",
                      }}
                      label="Email"
                      name="email"
                      defaultValue={selectedData.email}
                      error={errors.email ? true : false}
                      {...register("email", {
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-sm text-red w-full mt-[-0.6rem] mb-2 ml-1">
                        {errors.email.message}
                      </p>
                    )}
                    <TextField
                      fullWidth
                      select
                      sx={{
                        marginBottom: "15px",
                      }}
                      label="Email Status"
                      name="email_status"
                      defaultValue={selectedData.email_status}
                      error={selectedEmailStatus}
                      {...register("email_status", {
                        required: "This is required",
                      })}
                      SelectProps={{
                        MenuProps: {
                          disableScrollLock: true,
                        },
                      }}
                    >
                      <MenuItem value="">
                        <p
                          className="text-slate-500 text-[12px]"
                          onClick={() => {
                            setSelectedEmailStatus(true);
                          }}
                        >
                          Select one
                        </p>
                      </MenuItem>
                      <MenuItem
                        value="1"
                        onClick={() => {
                          setSelectedEmailStatus(false);
                        }}
                      >
                        TRUE
                      </MenuItem>
                      <MenuItem
                        value="0"
                        onClick={() => {
                          setSelectedEmailStatus(false);
                        }}
                      >
                        FALSE
                      </MenuItem>
                    </TextField>
                    {errors.email_status && (
                      <p className="text-sm text-red w-full mt-[-0.6rem] mb-2 ml-1">
                        {errors.email_status.message}
                      </p>
                    )}
                    <TextField
                      fullWidth
                      select
                      sx={{
                        marginBottom: "15px",
                      }}
                      label="Role"
                      name="role"
                      defaultValue={selectedData.role}
                      error={selectedRole}
                      {...register("role", {
                        required: "This is required",
                      })}
                      SelectProps={{
                        MenuProps: {
                          disableScrollLock: true,
                        },
                      }}
                    >
                      <MenuItem value="">
                        <p
                          className="text-slate-500 text-[12px]"
                          onClick={() => {
                            setSelectedRole(true);
                          }}
                        >
                          Select one
                        </p>
                      </MenuItem>
                      <MenuItem
                        value="Student"
                        onClick={() => {
                          setSelectedRole(false);
                        }}
                      >
                        Student
                      </MenuItem>
                      <MenuItem
                        value="Teacher"
                        onClick={() => {
                          setSelectedRole(false);
                        }}
                      >
                        Teacher
                      </MenuItem>
                      <MenuItem
                        value="Principal"
                        onClick={() => {
                          setSelectedRole(false);
                        }}
                      >
                        Principal
                      </MenuItem>
                      <MenuItem
                        value="SuperAdmin"
                        onClick={() => {
                          setSelectedRole(false);
                        }}
                      >
                        SuperAdmin
                      </MenuItem>
                      <MenuItem
                        value="Treasurer"
                        onClick={() => {
                          setSelectedRole(false);
                        }}
                      >
                        Treasurer
                      </MenuItem>
                      <MenuItem
                        value="Coordinator"
                        onClick={() => {
                          setSelectedRole(false);
                        }}
                      >
                        Coordinator
                      </MenuItem>
                      <MenuItem
                        value="Registrar"
                        onClick={() => {
                          setSelectedRole(false);
                        }}
                      >
                        Registrar
                      </MenuItem>
                      <MenuItem
                        value="Non-Teaching"
                        onClick={() => {
                          setSelectedRole(false);
                        }}
                      >
                        Non-Teaching
                      </MenuItem>
                    </TextField>
                    {errors.role && (
                      <p className="text-sm text-red w-full mt-[-0.6rem] mb-2 ml-1">
                        {errors.role.message}
                      </p>
                    )}
                    {errorMessage && (
                      <div className="text-red mb-5 mt-2">
                        <p>ERROR: {errorMessage}</p>
                      </div>
                    )}
                    <div className="modal-footer mt-4 flex justify-end gap-1">
                      <Button variant="outlined" onClick={closeModal}>
                        CLOSE
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disableElevation
                        onClick={() => {
                          {
                            watch("role") === ""
                              ? setSelectedRole(true)
                              : watch("role") === undefined
                              ? setSelectedRole(true)
                              : setSelectedRole(false);
                          }
                          {
                            watch("email_status") === ""
                              ? setSelectedEmailStatus(true)
                              : watch("email_status") === undefined
                              ? setSelectedEmailStatus(true)
                              : setSelectedEmailStatus(false);
                          }
                        }}
                      >
                        UPDATE
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateUser;
