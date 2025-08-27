// frontend/src/pages/DonorProfile.jsx
import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { useDonor } from "../context/DonorContext";
import ConfirmLogout from "../components/template/ConfirmLogout";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";

function DonorProfile() {
  const navigate = useNavigate();
  const { donorData, donorStats, fetchDonorData, fetchDonorStats, loading, error } =
    useDonor();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDonorData();
    fetchDonorStats();
  }, [fetchDonorData, fetchDonorStats]);

  return (
    <div className="min-h-screen bg-[#141C25] flex text-white">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="w-full flex-1 sm:ml-[300px] px-6 py-8 mb-18">
        {/* Profile Header */}
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-gray-400 mt-2">Manage your account information</p>

        {/* Loading & Error */}
        {loading && <p className="text-gray-400 mt-4">Loading...</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* User Information */}
        {donorData && (
          <div className="bg-[#1E2939] mt-6 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-[#F4C752] mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-400 text-sm">Full Name</p>
                <p className="text-lg">{donorData.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-lg">{donorData.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Phone</p>
                <p className="text-lg">{donorData.phone}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Address</p>
                <p className="text-lg">{donorData.address || "Not provided"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Donor Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div className="bg-[#1E2939] p-6 rounded-xl text-center shadow-lg">
            <div className="text-3xl font-bold text-[#F4C752]">
              {donorStats?.totalWeight || 0} kg
            </div>
            <p className="text-gray-400 text-sm mt-2">Total Quantity Donated</p>
          </div>
          <div className="bg-[#1E2939] p-6 rounded-xl text-center shadow-lg">
            <div className="text-3xl font-bold text-green-400">
              {donorStats?.timesDonated || 0}
            </div>
            <p className="text-gray-400 text-sm mt-2">Times Donated</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <button
            onClick={() => navigate("/donor-dashboard/request-pickup")}
            className="flex-1 bg-[#F4C752] text-black font-semibold py-3 rounded-lg shadow-md hover:bg-[#e5b93f] transition"
          >
            <i className="ri-add-line tex "></i> New Donation
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-red-700 transition"
          >
            <i className="ri-logout-box-line"></i> Logout
          </button>
        </div>
      </div>
      



      

      {/* Logout Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ConfirmLogout type={"donor"} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}

export default DonorProfile;
