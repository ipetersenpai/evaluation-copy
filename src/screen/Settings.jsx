import React from "react";
import Header from "../compnents/Header";
import ProfileCard from "../compnents/SettingsComponents/ProfileCard";
import Inputs from "../compnents/SettingsComponents/Inputs";
import Arrow from "../assets/fast-forward-double-right-arrows-symbol.png";
import { useNavigate } from "react-router-dom";
const Settings = () => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col  min-h-screen bg-backgroundColor overflow-hidden">
      <Header />
      <div className="flex mt-2 translate-x-10 gap-2 mb-4">
        <img src={Arrow} className="aspect-square w-7 rotate-180 cursor-pointer" onClick={() => navigate("/")}/>
        <h1 className=" text-2xl font-playfair font-bold ">
          Settings
        </h1>
      </div>
      <h1 className="border border-black mx-10"></h1>
      <div className="flex flex-col lg:flex-row justify-center items-center p-6 flex-1 gap-20">
        <ProfileCard />
        <Inputs />
      </div>
    </div>
  );
};

export default Settings;
