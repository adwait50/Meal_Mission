import React from "react";
import { Link } from "react-router";

function ConfirmLogout() {
  return (
    <div className=" w-full flex flex-col justify-center items-center ">
      <i className="ri-logout-box-r-line text-[#F4C752] text-3xl "></i>
      <h2 className="font-bold text-2xl mt-2 ">Sign Out</h2>
      <p className="mt-2 text-zinc-300">Are you sure you want to sign out?</p>
      <div className="flex mt-5 gap-3">
        <Link
          to={"/donor-logout"}
          className="bg-[#ddb44c] rounded-md px-3 py-2"
        >
          Sign Out
        </Link>
        <Link className="bg-[#364153] rounded-md px-3 py-2">Cancel</Link>
      </div>
    </div>
  );
}

export default ConfirmLogout;
