import { Link } from "react-router-dom";
import { useState } from "react";
import Modal from "../components/Modal";
import ConfirmLogout from "../components/template/ConfirmLogout";

function DonorDashboardContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full flex-1 h-full flex flex-col justify-center gap-5 px-4 sm:px-6 lg:px-8 py-8 z-10">
      <Link to={"/"}>
      <div className="sm:hidden font-bold " ><i className="ri-arrow-left-line"></i> Home</div>
      </Link>
      <div className="h-[30%] flex gap-3 flex-col justify-center px-7 py-20 rounded-2xl bg-[#364153]">
        <h1 className="text-2xl font-semibold">Browse Food Pickup Requests</h1>
        <h5 className="text-zinc-400">
          View and accept available food donation requests in your area
        </h5>
        <Link
          to="browse-pickup"
          className="bg-[#F4C752] inline-block px-3 text-center  w-36 py-2 text-black rounded-lg 
          transform transition-transform duration-200 hover:scale-105"
        >
          Browse Requests
        </Link>
      </div>
      <div className="h-[30%] flex gap-3 flex-col justify-center px-7 rounded-2xl bg-[#364153]">
        <h1 className="text-2xl font-semibold">Active Requests</h1>
        <h5 className="text-zinc-400">
          Track your current pickup assignments and their status
        </h5>
        <Link
          className="bg-[#F4C752] inline-block px-3 text-center w-36 py-2 text-black rounded-lg 
          transform transition-transform duration-200 hover:scale-105"
          to={"/ngo-dashboard/active-requests"}
        >
          Active Requests
        </Link>
      </div>
      <div className="h-[30%] flex gap-3 flex-col justify-center px-7 rounded-2xl bg-[#364153]">
        <h1 className="text-2xl font-semibold">Pickup History</h1>
        <h5 className="text-zinc-400">
          View your past pickups and total impact made
        </h5>
        <Link
          to="donation-history"
          className="bg-[#F4C752] inline-block px-3 text-center w-36 py-2 text-black rounded-lg 
          transform transition-transform duration-200 hover:scale-105"
        >
          View History
        </Link>
      </div>

      {/* Logout Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ConfirmLogout type={"ngo"} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}

export default DonorDashboardContent;