import React from "react";

const NotYetEvaluatedCard = ({ firstname, lastname }) => {
  return (
    <div
      className={`min-h-10 min-w-full bg-secondary rounded-md mt-4 text-black font-bold p-2`}
    >
      {lastname}, {firstname}
    </div>
  );
};

export default NotYetEvaluatedCard;
