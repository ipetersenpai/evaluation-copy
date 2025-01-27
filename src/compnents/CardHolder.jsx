import React from "react";

const CardHolder = ({ count, cardName }) => {
  return (
    <div className="md:min-w-[250px] min-h-[100px] w-full md:max-w-[250px] max-h-[100px] rounded-xl shadow-primary shadow-md drop-shadow-xl border-[1px] bg-white">
      <div className="p-2">
        <h1 className="text-gray-400 text-sm font-bold">{cardName}</h1>
        <h1 className="text-4xl text-black font-bold text-center">{count}</h1>
      </div>
    </div>
  );
};

export default CardHolder;
