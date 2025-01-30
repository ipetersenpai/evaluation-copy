import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AsyncForgotPassword } from "../../redux/slices/authSlice/forgotPasswordSlice";
import { AsyncLogin } from "../../redux/slices/authSlice/loginSlice";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOn from "../../assets/visibilityOn.png";
import SuccessImage from "../../assets/success.png";
import VisibilityOff from "../../assets/visibilityOff.png";
import TextField from "@mui/material/TextField";
import LoadingAnimation from "../LoadingAnimation";
import Cookies from "js-cookie";

const LoginCard = () => {
  const [isSuccess, setIsSuccess] = useState("");
  const [emailIsSuccess, setEmailIsSuccess] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const dispatch = useDispatch();

  // Redux state
  const { data, status } = useSelector((state) => state.userLogin);
  const { status: forgotPasswordStatus } = useSelector((state) => state.forgotPassword);

  const token = data ? data?.token : null;

  // Local state
  const [hiddenPassword, setHiddenPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  // React Hook Form
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: errorsLogin },
  } = useForm();

  const {
    register: registerForgotPassword,
    handleSubmit: handleSubmitForgotPassword,
    reset: resetForgotPassword,
    formState: { errors: errorsForgotPassword },
  } = useForm();

  // Handlers
  const handleSubmission = (credentials) => {
    dispatch(AsyncLogin(credentials));
    setIsSuccess("");
  };

  const handleForgotPassword = (email) => {
    setUserEmail(email.email);
    dispatch(AsyncForgotPassword(email));
  };

  const showPassword = () => {
    setHiddenPassword(!hiddenPassword);
  };

  const passwordForgot = () => {
    setForgotPassword(!forgotPassword);
    setEmailIsSuccess("");
  };

  // Effects
  useEffect(() => {
    if (status === "success") {
      setIsSuccess("success");
    } else if (status === "fail") {
      setIsSuccess("fail");
    }

    if (forgotPasswordStatus === "success") {
      setEmailIsSuccess("success");
      resetForgotPassword();
      setTimeout(() => {
        setForgotPassword(false);
      }, 3000);
    } else if (forgotPasswordStatus === "fail") {
      setEmailIsSuccess("fail");
    }
  }, [status, forgotPasswordStatus]);

  useEffect(() => {
    if (token) {
      Cookies.set("token", token);
      window.location.href = "/";
    }
  }, [token]);

  return (
    <div className="flex flex-col gap-8 items-center max-h-[600px] py-8 sm:w-2/3 w-[90%] sm:max-w-lg drop-shadow-2xl shadow-2xl rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50">
      <h1 className="font-semibold text-3xl md:text-4xl mt-4 text-gray-800">
        WELCOME TO{" "}
        <span className="font-playfair text-4xl md:text-5xl underline text-primary">
          LVAA
        </span>
      </h1>

      {!forgotPassword ? (
        <form
          className="flex flex-col gap-6 px-8 items-center justify-center w-full"
          onSubmit={handleSubmitLogin(handleSubmission)}
        >
          <div className="w-full">
            <TextField
              label="Username"
              name="username"
              {...registerLogin("username", { required: true })}
              aria-invalid={errorsLogin.username ? "true" : "false"}
              fullWidth
              variant="outlined"
              className="bg-white rounded-lg"
            />
            {errorsLogin.username?.type === "required" && (
              <p role="alert" className="text-sm text-red-600 w-full mt-1">
                Username is required
              </p>
            )}
          </div>

          <div className="w-full">
            <TextField
              label="Password"
              type={hiddenPassword ? "text" : "password"}
              autoComplete="current-password"
              fullWidth
              name="password"
              variant="outlined"
              className="bg-white rounded-lg"
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    onClick={showPassword}
                    className="cursor-pointer"
                  >
                    <img
                      src={hiddenPassword ? VisibilityOff : VisibilityOn}
                      alt="Visibility Toggle"
                      className="w-5 h-5"
                    />
                  </InputAdornment>
                ),
              }}
              {...registerLogin("password", { required: true })}
              aria-invalid={errorsLogin.password ? "true" : "false"}
            />
            {errorsLogin.password?.type === "required" && (
              <p role="alert" className="text-sm text-red-600 w-full mt-1">
                Password is required
              </p>
            )}
          </div>

          <div className="flex w-full justify-start">
            {status === "loading" && (
              <LoadingAnimation message="Verifying Credentials, please wait" />
            )}
            {isSuccess === "fail" && (
              <h1 className="text-sm text-red-600 font-bold">Invalid Credentials</h1>
            )}
          </div>

          <div className="w-full">
            <p
              className="hover:text-blue-700 hover:underline cursor-pointer text-start w-max font-bold text-sm"
              onClick={passwordForgot}
            >
              Forgot password?
            </p>
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-primary-dark transition duration-200 ease-in-out text-white font-bold font-playfair text-lg w-full py-2 rounded-lg"
          >
            LOGIN
          </button>
        </form>
      ) : (
        <>
          {emailIsSuccess === "success" ? (
            <div className="flex flex-col items-center w-full p-4">
              <img src={SuccessImage} alt="Success" className="w-20 h-20 mb-4" />
              <h1 className="font-bold text-2xl text-gray-800">Yahoo!</h1>
              <p className="text-sm text-center text-gray-600">
                We've sent instructions on how to reset your password to{" "}
                <span className="font-bold">{userEmail}</span>.
              </p>
            </div>
          ) : (
            <form
              className="flex flex-col gap-4 min-h-[250px] px-6 items-center justify-evenly w-full"
              onSubmit={handleSubmitForgotPassword(handleForgotPassword)}
            >
              <div className="w-full">
                <TextField
                  label="Email"
                  name="email"
                  {...registerForgotPassword("email", {
                    required: true,
                    pattern: {
                      value: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
                      message: "Please use a valid email address",
                    },
                  })}
                  aria-invalid={errorsForgotPassword.email ? "true" : "false"}
                  fullWidth
                  variant="outlined"
                  className="bg-white rounded-lg"
                />
                {errorsForgotPassword.email?.type === "required" && (
                  <p role="alert" className="text-sm text-red-600 w-full mt-1">
                    Email is required
                  </p>
                )}
                {errorsForgotPassword.email && (
                  <p role="alert" className="text-sm text-red-600 w-full mt-1">
                    {errorsForgotPassword.email.message}
                  </p>
                )}
              </div>

              <div className="flex w-full">
                {forgotPasswordStatus === "loading" && (
                  <LoadingAnimation message="Verifying, please wait." />
                )}
                {forgotPasswordStatus === "fail" && (
                  <h1 className="text-sm text-red-600">Email does not exist</h1>
                )}
              </div>

              <div className="w-full">
                <p
                  className="hover:text-blue-700 hover:underline cursor-pointer text-start w-max font-bold text-sm"
                  onClick={passwordForgot}
                >
                  Back to login
                </p>
              </div>

              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark transition duration-200 ease-in-out text-white font-bold font-playfair text-lg w-full py-2 rounded-lg"
              >
                SEND
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default LoginCard;