import { useState } from "react";
import { Link, NavLink } from "react-router";
import Modal from "./Modal";
import ConfirmLogout from "./template/ConfirmLogout";

function AdminSideBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* ===== Desktop Sidebar ===== */}
      <div className="hidden md:flex h-screen bg-[#141C25] fixed left-0 top-0 w-[300px] flex-col justify-start py-8 border-r border-gray-600">
        <div className="flex h-full flex-col justify-between ">
          <div className="flex flex-col justify-start items-center">
            <Link to={"/"}>
              <h1 className="text-3xl">Meal mission</h1>
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
                to={"/admin-dashboard"}
              >
                Dashboard
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 justify-center text-center px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#F4C752] text-[#141C25] font-semibold"
                      : "text-white hover:bg-[#364153]"
                  }`
                }
                to={"/pending-ngos"}
              >
                Pending NGOs
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 justify-center text-center px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#F4C752] text-[#141C25] font-semibold"
                      : "text-white hover:bg-[#364153]"
                  }`
                }
                to={"/admin-support"}
              >
                Support requests
              </NavLink>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex cursor-pointer items-center gap-3 justify-center text-center px-4 py-2 rounded-lg transition-colors text-white hover:bg-[#364153]"
              >
                Logout
              </button>
              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ConfirmLogout
                  type={"admin"}
                  onClose={() => setIsModalOpen(false)}
                />
              </Modal>
            </div>
          </div>
          <div className=" flex justify-center items-center  w-full">
            <i className="ri-user-fill text-xl border-2 rounded-full px-2 py-1"></i>
            <div className="px-5">
              <h5 className="text-2xl font-semibold">Admin</h5>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Mobile Bottom Nav ===== */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#141C25] border-t border-gray-600 flex justify-around items-center py-2 text-white text-sm z-50">
        <NavLink
          to={"/admin-dashboard"}
          className={({ isActive }) =>
            `flex flex-col items-center ${
              isActive ? "text-[#F4C752]" : "text-white"
            }`
          }
        >
          <i className="ri-dashboard-line text-xl"></i>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to={"/pending-ngos"}
          className={({ isActive }) =>
            `flex flex-col items-center ${
              isActive ? "text-[#F4C752]" : "text-white"
            }`
          }
        >
          <i className="ri-building-line text-xl"></i>
          <span>Pending</span>
        </NavLink>

        <NavLink
          to={"/admin-support"}
          className={({ isActive }) =>
            `flex flex-col items-center ${
              isActive ? "text-[#F4C752]" : "text-white"
            }`
          }
        >
          <i className="ri-customer-service-2-line text-xl"></i>
          <span>Support</span>
        </NavLink>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center"
        >
          <i className="ri-logout-box-r-line text-xl"></i>
          <span>Logout</span>
        </button>
      </div>

      {/* Mobile Logout Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ConfirmLogout type={"admin"} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
}

export default AdminSideBar;
