import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@mui/material";


const TopNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSidebar, setOpenSidebar] = useState(false);
  const [showName, setShowName] = useState(false);

  useEffect(() => {
    if (openSidebar) {
      const timeoutId = setTimeout(() => {
        setShowName(true);
      }, 200);

      return () => clearTimeout(timeoutId);
    } else {
      setShowName(false);
    }
  }, [openSidebar]);

  const Logout = () => {
    Cookies.remove("token");
    window.location.href = "/";
  };

  return (
    <>
      <div className=" fixed flex flex-row justify-between bg-[#6d2932] w-full h-[50px] laptop:h-[60px] justify-items-center items-center p-4 overflow-hidden z-50">
        <div className="flex flex-row items-center gap-2 text-white">
          <button
            className="text-[30px] cursor-pointer md:hidden"
            onClick={() => {
              setOpenSidebar(true);
            }}
          >OPEN</button>
          {/* <img src={Logo} className="h-[40px] min-w-[40px]" /> */}
          <p className="font-sans text-white text-[18px] laptop:text-[24px] hidden md:block">
            Lake View Adventist Academy
          </p>
        </div>

        <Button variant="contained" disableElevation sx={{ minWidth: "100px" }} onClick={Logout}>
          LOGOUT
        </Button>
      </div>

      {/* -----------------Superadmin Side bar content------------------- */}
      <div
        className={`${
          openSidebar
            ? "w-[259px] ease-out-in duration-500"
            : "w-0 ease-in-out duration-500"
        } h-full text-white flex flex-col absolute z-50`}
      >
        {/* ----Menu icon---- */}
        <div
          className={`flex justify-end pt-4 ${
            openSidebar
              ? "w-[259px] ease-out-in duration-500 "
              : "w-0 ease-in-out duration-500 justify-center"
          } cursor-pointer`}
          onClick={() => {
            setOpenSidebar(!openSidebar);
          }}
        >
         
        </div>
        {/* ----Menu item---- */}
        <div
          className={`bg-[#08273E] pt-[62px] ease-out-in duration-500 fixed
            flex-wrap h-[100vh]
            ${openSidebar ? "w-[259px]" : "w-0"} mb-50`}
        >
          <div
            className={`flex flex-row gap-4 max-auto p-2 items-center hover:bg-[#7E1F21] cursor-pointer ${
              location.pathname === "/" ? "bg-[#7E1F21]" : ""
            } ${openSidebar ? "flex" : "hidden"}`}
            onClick={() => {
              //change it to the actual path
              navigate("/");
            }}
          >
            {/* ----Add if else condition here for dynamic user profile---- */}
            <div
              className={`h-[42px] min-w-[42px] items-center justify-center ${
                openSidebar ? "flex" : "hidden"
              }`}
            >
              {/* <IoHomeSharp className="text-[24px]" /> */}
            </div>
            {showName && <p className={`text-bold text-[18px]`}>Dashboard</p>}
          </div>

          <div
            className={`flex flex-row gap-4 max-auto p-2 items-center hover:bg-[#7E1F21] cursor-pointer ${
              location.pathname === "/session/schoolyear" ? "bg-[#7E1F21]" : ""
            } ${openSidebar ? "flex" : "hidden"}`}
            onClick={() => {
              //change it to the actual path
              navigate("/session/schoolyear");
            }}
          >
            {/* ----Add if else condition here for dynamic user profile---- */}
            <div
              className={`h-[42px] min-w-[42px] items-center justify-center ${
                openSidebar ? "flex" : "hidden"
              }`}
            >
              {/* <IoSettingsSharp className="text-[24px]" /> */}
            </div>
            {showName && <p className={`text-bold text-[18px]`}>Session</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default TopNavbar;
