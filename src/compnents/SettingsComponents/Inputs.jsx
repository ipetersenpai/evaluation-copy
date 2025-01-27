import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { useForm, Controller } from "react-hook-form";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { AsyncChangePassword } from "../../redux/slices/authSlice/changePasswordSlice";
import { AsyncUpdateEmail } from "../../redux/slices/authSlice/updateEmailSlice";
import { updateProfile } from "../../redux/slices/userSlice/updateInfoSlice";
import LoadingAnimation from "../LoadingAnimation";
import JwtDecoder from "../JwtDecoder";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
const Inputs = () => {
  const dispatch = useDispatch();
  const userData = JwtDecoder()?.decodedToken;
  const id = userData ? userData?.id : null;
  // password
  const changePasswordLoading = useSelector((state) => state.changePassword.loading);
  const changePasswordStatus = useSelector((state) => state.changePassword.status)

  // Email
  const updateEmailLoading = useSelector((state) => state.updateEmail.loading);
  const updateEmailStatus = useSelector((state) => state.updateEmail.status);

  // profile
  const { data, status, loading, error } = useSelector((state) => state.updateInfo);
  console.log(data);
  const {
    control,
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: errorsProfile },
    reset: resetProfile,
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
    reset: resetPassword,
  } = useForm();

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsEmail },
    reset: resetEmail,
  } = useForm();

  const onSubmit = (data) => {
    dispatch(updateProfile({ value: data, id: id }));
  };

  const changePassword = (values) => {
    dispatch(AsyncChangePassword({ credentials: values, id: id }));
    
  };

  const UpdateEmail = (email) => {
    dispatch(AsyncUpdateEmail({ email: email, id: id }));
  
  };

  useEffect(() => {
    if (status === "success") {
      resetProfile();
    }

    if (changePasswordStatus === "success"){
      resetPassword()
    }

    if(updateEmailStatus === "success"){
      resetEmail()
    }
  }, [status, changePasswordStatus, updateEmailStatus]);
  return (
    <div className="flex flex-col lg:max-w-[1000px] min-h-[500px] max-h-[500px] flex-1 border-2 w-full bg-white p-10 gap-10 overflow-auto ">
      <form
        className="flex flex-col gap-4 border-[1px] border-black p-4 rounded-lg"
        onSubmit={handleSubmitProfile(onSubmit)}
      >
        <h1 className="uppercase font-bold">user profile</h1>

        <div className="flex flex-col md:flex-row gap-4 mt-4 w-full">
          <div className="flex flex-col w-full">
            <TextField
              label="First Name"
              variant="outlined"
              error={Boolean(errorsProfile.first_name)}
              name="first_name"
              {...registerProfile("first_name", { required: true })}
              aria-invalid={errorsProfile.first_name ? "true" : "false"}
            />
            {errorsProfile.first_name?.type === "required" && (
              <p role="alert" className="text-red-600 text-sm">
                First name is required
              </p>
            )}
          </div>

          <div className="flex flex-col w-full">
            <TextField
              label="Last Name"
              name="last_name"
              error={Boolean(errorsProfile.last_name)}
              variant="outlined"
              {...registerProfile("last_name", { required: true })}
              aria-invalid={errorsProfile.last_name ? "true" : "false"}
            />
            {errorsProfile.last_name?.type === "required" && (
              <p role="alert" className="text-red-600 text-sm">
                Last name is required
              </p>
            )}
          </div>
        </div>
        {loading && <LoadingAnimation message="Updating profile information, please wait"/>}
        <Button variant="contained" type="submit">
          Change name
        </Button>
      </form>
      <form
        className="flex flex-col gap-6 w-full border-[1px] border-black p-4 rounded-lg"
        onSubmit={handleSubmitPassword(changePassword)}
      >
        <h1 className="uppercase font-bold">Passwords</h1>

        <div className="flex flex-col md:flex-row gap-4 mt-4 w-full">
          <div className="flex flex-col w-full">
            <TextField
              label="Current password"
              variant="outlined"
              error={Boolean(errorsPassword.current_password)}
              fullWidth
              name="current_password"
              {...registerPassword("current_password", {
                required: true,
              })}
              aria-invalid={errorsPassword.current_password ? "true" : "false"}
            />
            {errorsPassword.current_password?.type === "required" && (
              <p role="alert" className="text-red-600 text-sm">
                Current password is required
              </p>
            )}
          </div>
          <div className="flex flex-col w-full ">
            <TextField
              label="New password"
              variant="outlined"
              error={Boolean(errorsPassword.new_password)}
              fullWidth
              name="new_password"
              {...registerPassword("new_password", { required: true })}
              aria-invalid={errorsPassword.new_password ? "true" : "false"}
            />
            {errorsPassword.new_password?.type === "required" && (
              <p role="alert" className="text-red-600 text-sm">
                New password is required
              </p>
            )}
          </div>
        </div>
        {changePasswordLoading && <LoadingAnimation message="Updating password, please wait" />}
        <Button variant="contained" type="submit">
          Change Password
        </Button>
      </form>
      <form
        className="flex flex-col gap-3 w-full space-y-3  border-[1px] border-black p-4 rounded-lg"
        onSubmit={handleSubmitEmail(UpdateEmail)}
      >
        <h1 className="uppercase font-bold">email</h1>

        <div className="flex flex-col mt-4 w-full">
          <TextField
            label="Email"
            variant="outlined"
            error={Boolean(errorsEmail.email)}
            name="email"
            fullWidth
            {...registerEmail("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            aria-invalid={errorsEmail.email ? "true" : "false"}
          />
          {errorsEmail.email && (
            <p role="alert" className="text-red-600 text-sm">
              {errorsEmail.email.message}
            </p>
          )}
        </div>
        {updateEmailLoading && (
          <LoadingAnimation message="Updating email, please wait" />
        )}

        <Button variant="contained" type="submit">
          Change email
        </Button>
      </form>
    </div>
  );
};

export default Inputs;
