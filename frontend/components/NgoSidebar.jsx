import { Link, NavLink } from "react-router";
import { useNgo } from "../context/NgoContext";
import Modal from "./Modal";
import ConfirmLogout from "./template/ConfirmLogout";
import { useState } from "react";

function NgoSideBar() {
  const { ngoData } = useNgo();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden sm:flex h-screen bg-[#141C25] fixed left-0 top-0 w-[300px] flex-col justify-between py-8 border-r border-gray-600">
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col items-center">
            <Link to={"/"}>
              <h1 className="text-3xl">Meal mission</h1>
            </Link>
            <div className="flex flex-col gap-7 w-[60%] mt-8 text-lg">
              <NavLink
                className={({ isActive }) =>
                  `flex items-center justify-center gap-3 text-center px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#F4C752] text-[#141C25] font-semibold"
                      : "text-white hover:bg-[#364153]"
                  }`
                }
                to={"/ngo-dashboard"}
              >
                <i className="ri-home-4-line text-2xl"></i> Dashboard
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 justify-center text-center px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#F4C752] text-[#141C25] font-semibold"
                      : "text-white hover:bg-[#364153]"
                  }`
                }
                to={"/ngo-profile"}
              >
                <i className="ri-user-3-line text-2xl"></i> Profile
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 justify-center text-center px-1 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#F4C752] text-[#141C25] font-semibold"
                      : "text-white hover:bg-[#364153]"
                  }`
                }
                to={"/ngo-support"}
              >
                <i className="ri-questionnaire-line text-2xl"></i> Support & Help
              </NavLink>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex cursor-pointer items-center gap-3 justify-center text-center px-4 py-2 rounded-lg transition-colors text-white hover:bg-[#364153]"
              >
                <i className="ri-logout-box-r-line"></i> Logout
              </button>
              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ConfirmLogout type={"ngo"} onClose={() => setIsModalOpen(false)} />
              </Modal>
            </div>
          </div>

          <div className="flex justify-center items-center w-full mt-8">
            <i className="ri-user-fill text-xl border-2 rounded-full px-2 py-1"></i>
            <div className="px-5">
              <h5 className="text-2xl font-semibold">{ngoData?.name}</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full sm:hidden bg-[#141C25] border-t border-gray-600 flex justify-around py-2 z-50">
        <NavLink
          to={"/ngo-dashboard"}
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive ? "text-[#F4C752]" : "text-white"
            }`
          }
        >
          <i className="ri-home-4-line text-2xl"></i>
          Dashboard
        </NavLink>

        <NavLink
          to={"/ngo-profile"}
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive ? "text-[#F4C752]" : "text-white"
            }`
          }
        >
          <i className="ri-user-3-line text-2xl"></i>
          Profile
        </NavLink>

        <NavLink
          to={"/ngo-support"}
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive ? "text-[#F4C752]" : "text-white"
            }`
          }
        >
          <i className="ri-questionnaire-line text-2xl"></i>
          Support
        </NavLink>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center text-xs text-white"
        >
          <i className="ri-logout-box-r-line text-2xl"></i>
          Logout
        </button>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ConfirmLogout type={"ngo"} onClose={() => setIsModalOpen(false)} />
        </Modal>
      </div>
    </>
  );
}

export default NgoSideBar;
