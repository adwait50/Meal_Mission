import React from "react";

function NgoApproved({ ngoId, flag }) {
  return (
    <div className="text-white p-7 text-lg">
      <div className="mt-5">
        {" "}
        <span className="font-semibold">{ngoId}</span> NGO{" "}
        {flag ? <span>approved.</span> : <span>rejected.</span>}{" "}
      </div>
    </div>
  );
}

export default NgoApproved;
