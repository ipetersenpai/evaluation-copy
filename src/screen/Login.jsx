import React from "react";
import LoginCard from "../compnents/LoginComponents/LoginCard";
import Loginimage from "../assets/login.webp"
const Login = () => {
  return (
    <div className="flex justify-center items-center h-screen  bg-cover bg-no-repeat bg-current bg-blue-600" style={{ backgroundImage: `url(${Loginimage})` }}>
     
      <LoginCard />
    </div>
  );
};

export default Login;
