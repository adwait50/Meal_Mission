import React, { useState } from "react";
import NgoSideBar from "../components/NgoSidebar";
import { useNgo } from "../context/NgoContext";
import Modal from "../components/Modal";
import ConfirmLogout from "../components/template/ConfirmLogout";
import { useNavigate } from "react-router-dom";

const NgoProfile = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { ngoData, stats, loading } = useNgo();

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#141C25] flex flex-col sm:flex-row text-white">
      {/* Sidebar */}
      <NgoSideBar />

      {/* Main content */}
      <div className="flex-1 pb-22 p-4 sm:p-8 mt-4 sm:mt-0 sm:ml-[300px]">
        {/* Heading */}
        <h1 className="text-3xl font-bold mb-6">NGO Profile</h1>

        {/* NGO Info */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 shadow-md">
          <h2 className="text-2xl font-bold mb-2">{ngoData?.name}</h2>
          <p className="text-gray-400 mb-4">{ngoData?.email}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 mb-1">Phone Number</p>
              <p>{ngoData?.phone}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Address</p>
              <p>{ngoData?.address}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">State</p>
              <p>{ngoData?.state}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">City</p>
              <p>{ngoData?.city}</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800 p-6 rounded-lg shadow-md">
              <h3 className="text-gray-400 mb-2">Total Donations</h3>
              <p className="text-3xl sm:text-4xl font-bold">
                {stats.totalDonations}
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg shadow-md">
              <h3 className="text-gray-400 mb-2">Completed Donations</h3>
              <p className="text-3xl sm:text-4xl font-bold text-emerald-400">
                {stats.completedDonations}
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg shadow-md">
              <h3 className="text-gray-400 mb-2"> Donations Rejected</h3>
              <p className="text-3xl sm:text-4xl font-bold text-red-400">
                {stats.rejectedDonations}
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg shadow-md">
              <h3 className="text-gray-400 mb-2">Total Weight</h3>
              <p className="text-3xl sm:text-4xl font-bold text-blue-400">
                {stats.totalWeight} kg
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg shadow-md">
              <h3 className="text-gray-400 mb-2">Times Donated</h3>
              <p className="text-3xl sm:text-4xl font-bold text-yellow-400">
                {stats.timesDonated}
              </p>
            </div>
          </div>
        )}


        <div className="flex flex-col sm:flex-row gap-4 w-full">
          {/* View All Donations */}
          <button 
          onClick={()=>navigate("/ngo-dashboard/donation-history")}
           className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-6 rounded-lg shadow-md transition">
            View All Donations
          </button>

          {/* Logout */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-red-700 transition"
          >
            <i className="ri-logout-box-line text-lg"></i>
            Logout
          </button>
        </div>


        {/* Logout Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ConfirmLogout type={"ngo"} />
        </Modal>
      </div>
    </div>
  );
};

export default NgoProfile;
