import React from "react";
import { Link } from "react-router";

function ConfirmLogout({ type }) {
  console.log(type);
  return (
    <div className=" w-full flex flex-col justify-center items-center ">
      <i className="ri-logout-box-r-line text-[#F4C752] text-3xl "></i>
      <h2 className="font-bold text-2xl mt-2 ">Sign Out</h2>
      <p className="mt-2 text-zinc-300">Are you sure you want to sign out?</p>
      <div className="flex mt-5 gap-3">
        <Link
          to={type === "donor" ? "/donor-logout" : "/ngo-logout"}
          className="bg-[#ddb44c] rounded-md px-6 py-2"
        >
          Sign Out
        </Link>
      </div>
    </div>
  );
}

export default ConfirmLogout;
