import React, { useEffect, useState } from "react";
import avatar from "../../assets/Avatar.png";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserInformation } from "../../redux/slices/userSlice/userInfoSlice";
import JwtDecoder from "../JwtDecoder";
const ProfileCard = () => {
  const dispatch = useDispatch();
  const userData = JwtDecoder().decodedToken;
  const data = useSelector((state) => state.userInfo);
  const firstname = data?.data?.data?.first_name
  const lastname = data?.data?.data?.last_name
  const email = data?.data?.data?.email

  useEffect(() => {
    if (userData) {
      const id = userData?.id;
      dispatch(fetchUserInformation({ id: id }));
    }
  }, [dispatch, userData]);

  return (
    <div className="flex flex-col justify-center items-center min-h-[500px] lg:max-w-[400px] w-full rounded-2xl flex-1 bg-secondary text-white ">
      <img src={avatar} className="aspect-square h-40" />
      <div className="flex flex-col w-full justify-start p-10 gap-10">
        <div className="border py-2 p-2 rounded-lg border-black bg-white text-black">
          <h1 className="text-xl font-bold">Firstname: {firstname}</h1>
        </div>
        <div className="border py-2 p-2 rounded-lg border-black bg-white text-black">
          <h1 className="text-xl font-bold">Last Name: {lastname}</h1>
        </div>
        <div className="border py-2 p-2 rounded-lg border-black bg-white text-black">
          <h1 className="text-xl font-bold">Email: {email}</h1>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
