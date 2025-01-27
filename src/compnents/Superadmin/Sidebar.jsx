import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSidebar, setOpenSidebar] = useState(true);
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

  return (
    <>
      <div
        className={`${
          openSidebar
            ? "w-[259px] ease-out-in duration-500"
            : "w-[60px] ease-in-out duration-500"
        } h-full text-white md:flex flex-col md:relative hidden z-10 pt-[50px]`}
      >
        {/* ----Menu icon---- */}
        <div
          className={`flex justify-end pt-4 ${
            openSidebar
              ? "w-[259px] ease-out-in duration-500 "
              : "w-[60px] ease-in-out duration-500 justify-center"
          } cursor-pointer`}
          onClick={() => {
            setOpenSidebar(!openSidebar);
          }}
        >
          {openSidebar ? (
            <button className="mr-2 fixed z-30 text-[20px]">&#9776;</button>
          ) : (
            // <IoCloseSharp className="mr-2 fixed z-10 text-[35px]" />
            // <IoMenu className="mr-2 fixed z-10 text-[35px]" />
            <button className="mr-2 fixed z-30 text-[20px]">&#9776;</button>
          )}
        </div>
        {/* ----Menu item---- */}
        <div
          className={`bg-[#08273E] pt-[62px] ease-out-in duration-500 fixed
            flex-wrap h-[100vh]
            ${openSidebar ? "w-[259px]" : "w-[60px]"} mb-50`}
        >
          <div
            className={`flex flex-row gap-4 max-auto p-2 items-center hover:bg-[#7E1F21] cursor-pointer ${
              location.pathname === "/" ? "bg-[#7E1F21]" : ""
            }`}
            onClick={() => {
              //change it to the actual path
              navigate("/");
            }}
          >
            {/* ----Add if else condition here for dynamic user profile---- */}
            <div className="h-[42px] min-w-[42px]  flex items-center justify-center">
              {/* <IoHomeSharp className="text-[24px]" /> */}
            </div>
            {showName && <p className={`text-bold text-[18px]`}>Dashboard</p>}
          </div>

          <div
            className={`flex flex-row gap-4 max-auto p-2 items-center hover:bg-[#7E1F21] cursor-pointer ${
              location.pathname === "/session/schoolyear" ? "bg-[#7E1F21]" : ""
            }`}
            onClick={() => {
              //change it to the actual path
              navigate("/session/schoolyear");
            }}
          >
            {/* ----Add if else condition here for dynamic user profile---- */}
            <div className="h-[42px] min-w-[42px]  flex items-center justify-center">
              {/* <IoSettingsSharp className="text-[24px]" /> */}
            </div>
            {showName && <p className={`text-bold text-[18px]`}>Session</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
