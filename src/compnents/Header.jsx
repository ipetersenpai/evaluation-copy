import React, { useEffect, useState } from "react";
import JwtDecoder from "./JwtDecoder";
import Logo from "../assets/Logo.png";
import avatar from "../assets/Avatar.png";
import Logout from "../assets/icons8-logout-100.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Settings from "../assets/settings.png";
import { fetchUserInformation } from "../redux/slices/userSlice/userInfoSlice";
const Header = () => {
  const userData = JwtDecoder().decodedToken;
  const id = userData ? userData?.id : "";
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.userInfo);
  const firstname = data?.data?.first_name;
  const lastname = data?.data?.last_name;
  const [openDropdown, setOpenDropdown] = useState(false);
  const navigate = useNavigate();

  const handleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const navigateToSettings = () => {
    navigate("/Settings");
  };

  const handleLogout = () => {
    Cookies.remove("token");
    window.location.href = "/";
  };

  useEffect(() => {
    if (id && status === "idle") {
      dispatch(fetchUserInformation({ id: id }));
    }
  }, [id, dispatch, status]);
  return (
    <div className="flex items-center justify-between  h-20 bg-primary px-3">
      <div className="flex gap-4 items-center">
        <img src={Logo} className="aspect-square h-20 inline-block" />
        <h1 className="font-playfair text-white font-bold text-xl inline-block">
          Lake View Adventist Academy
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <h1 className="hidden lg:block text-lg text-white">
          {firstname} {lastname}
        </h1>

        <div className="relative">
          <button onClick={handleDropdown}>
            <img src={avatar} className="h-10 aspect-square" />
          </button>{" "}
          <div
            className={`${
              openDropdown
                ? "absolute min-w-40 shadow-2xl drop-shadow-2xl bg-white min-h-max border -translate-x-[120px] mt-6 z-20"
                : "hidden"
            }`}
          >
            <section className="p-2">
              <div
                className="flex  items-center mt-3 "
                onClick={navigateToSettings}
              >
                <img
                  src={Settings}
                  className="aspect-square h-6  inline-block mr-6"
                />
                <p className="hover:cursor-pointer inline-block text-sm font-bold hover:scale-110 duration-200 ease-in">
                  Settings
                </p>
              </div>
              <div className="flex  items-center mt-3 " onClick={handleLogout}>
                <img
                  src={Logout}
                  className="aspect-square h-6  inline-block mr-6"
                />
                <p
                  className="hover:cursor-pointer inline-block text-sm font-bold hover:scale-110 duration-200 ease-in"
                  href="/"
                >
                  Logout
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
