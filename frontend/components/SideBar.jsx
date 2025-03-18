import React from "react";
import { Link, NavLink } from "react-router";
import { useDonor } from "../context/DonorContext";

function SideBar() {
  const { donorData, error } = useDonor();
  // console.log(donorData);

  return (
    <div className="h-screen bg-[#141C25] fixed left-0 top-0 w-[300px] flex flex-col justify-start py-8 border-r border-gray-600">
      <div className="flex h-full flex-col justify-between ">
        <div className="flex flex-col justify-start items-center">
          <Link to={"/"}>
            <h1 className="text-3xl text-white">Meal mission</h1>
          </Link>
          <div className="flex flex-col gap-7  w-[60%] mt-8 text-lg">
            <NavLink
              className={({ isActive }) =>
                `flex items-center justify-center gap-3 text-center px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#F4C752] text-[#141C25] font-semibold"
                    : "text-white hover:bg-[#364153]"
                }`
              }
              to={"/donor-dashboard"}
            >
              Dashboard
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center justify-center gap-3 text-center px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#F4C752] text-[#141C25] font-semibold"
                    : "text-white hover:bg-[#364153]"
                }`
              }
              to={"/donor-donations"}
            >
              Donations
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 justify-center text-center px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#F4C752] text-[#141C25] font-semibold"
                    : "text-white hover:bg-[#364153]"
                }`
              }
              to={"/donor-profile"}
            >
              Profile
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 justify-center text-center px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#F4C752] text-[#141C25] font-semibold"
                    : "text-white hover:bg-[#364153]"
                }`
              }
              to={"/donor-setting"}
            >
              Settings
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 justify-center text-center px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#F4C752] text-[#141C25] font-semibold"
                    : "text-white hover:bg-[#364153]"
                }`
              }
              to={"/donor-support"}
            >
              Support & Help
            </NavLink>
          </div>
        </div>
        <div className=" flex text-white justify-center items-center  w-full">
          <i className="ri-user-fill text-xl border-2 rounded-full px-2 py-1"></i>
          <div className="px-5">
            <h5 className="text-2xl  font-semibold">{donorData?.name}</h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
