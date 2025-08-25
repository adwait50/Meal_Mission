import React, { useState } from "react";
import { NavLink, Link } from "react-router";
import { useDonor } from "../context/DonorContext";
import Modal from "./Modal";
import ConfirmLogout from "./template/ConfirmLogout";

function SideBar() {
  const { donorData } = useDonor();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen bg-[#141C25] fixed left-0 top-0 w-[300px] flex-col justify-between py-8 border-r border-gray-600">
        <div className="flex flex-col justify-start items-center">
          <Link to={"/"} className="mb-8">
            <h1 className="text-3xl text-white">Meal mission</h1>
          </Link>
          <div className="flex flex-col justify-center items-center gap-7 w-[60%] text-lg">
            <NavLink
              className={({ isActive }) =>
                `flex items-center justify-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#F4C752] text-[#141C25] font-semibold"
                    : "text-white hover:bg-[#364153]"
                }`
              }
              to={"/donor-dashboard"}
            >
              <i className="ri-home-4-line text-2xl"></i>
              Dashboard
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 justify-center px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#F4C752] text-[#141C25] font-semibold"
                    : "text-white hover:bg-[#364153]"
                }`
              }
              to={"/donor-profile"}
            >
              <i className="ri-user-3-line text-2xl"></i>
              Profile
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 justify-center px-1 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#F4C752] text-[#141C25] font-semibold"
                    : "text-white hover:bg-[#364153]"
                }`
              }
              to={"/donor-support"}
            >
              <i className="ri-questionnaire-line text-2xl"></i>
              Support & Help
            </NavLink>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-white hover:bg-[#364153]"
            >
              <i className="ri-logout-box-r-line"></i>
              Logout
            </button>
          </div>
        </div>

        <Link
          to="/donor-profile"
          className="flex text-white justify-center items-center cursor-pointer w-full"
        >
          <i className="ri-user-fill text-xl border-2 rounded-full px-2 py-1"></i>
          <div className="px-5">
            <h5 className="text-2xl font-semibold">{donorData?.name}</h5>
          </div>
        </Link>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#141C25] border-t border-gray-600 flex justify-around py-3">
        <NavLink
          to="/donor-dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center text-sm ${
              isActive ? "text-[#F4C752]" : "text-white"
            }`
          }
        >
          <i className="ri-home-4-line text-2xl"></i>
          Dashboard
        </NavLink>

        <NavLink
          to="/donor-profile"
          className={({ isActive }) =>
            `flex flex-col items-center text-sm ${
              isActive ? "text-[#F4C752]" : "text-white"
            }`
          }
        >
          <i className="ri-user-3-line text-2xl"></i>
          Profile
        </NavLink>

        <NavLink
          to="/donor-support"
          className={({ isActive }) =>
            `flex flex-col items-center text-sm ${
              isActive ? "text-[#F4C752]" : "text-white"
            }`
          }
        >
          <i className="ri-questionnaire-line text-2xl"></i>
          Support
        </NavLink>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center text-sm text-white"
        >
          <i className="ri-logout-box-r-line text-2xl"></i>
          Logout
        </button>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ConfirmLogout type={"donor"} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
}

export default SideBar;
