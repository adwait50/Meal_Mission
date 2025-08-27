import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { useDonor } from "../context/DonorContext";
import ConfirmLogout from "../components/template/ConfirmLogout";
import Modal from "../components/Modal";

function DonorProfile() {
  const { donorData, fetchDonorData } = useDonor();

  useEffect(() => {
    fetchDonorData();
  }, [fetchDonorData]);
  console.log(donorData);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#141C25] flex text-white">
      <SideBar />
      <div className="w-full flex-1 sm:ml-[300px] px-6 py-8 mb-18 ">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="text-gray-400 mt-2">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-[#1E2939] rounded-xl p-8 mb-8">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-20 h-20 bg-[#F4C752] rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-[#141C25]">
                {donorData?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{donorData?.name}</h2>
              <p className="text-gray-400">{donorData?.email}</p>
              <div className="flex items-center mt-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    donorData?.isVerified
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {donorData?.isVerified ? "✓ Verified" : "⏳ Pending"}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Phone</label>
              <p className="text-lg">{donorData?.phone}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Address</label>
              <p className="text-lg">{donorData?.address}</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1E2939] p-6 rounded-xl">
            <div className="text-3xl font-bold text-[#F4C752]">
              {donorData?.stats?.totalDonations || 0}
            </div>
            <div className="text-gray-400 text-sm">Total Donations</div>
          </div>
          <div className="bg-[#1E2939] p-6 rounded-xl">
            <div className="text-3xl font-bold text-green-400">
              {donorData?.stats?.completedDonations || 0}
            </div>
            <div className="text-gray-400 text-sm">Completed Donations</div>
          </div>
          <div className="bg-[#1E2939] p-6 rounded-xl">
            <div className="text-3xl font-bold text-red-400">
              {donorData?.stats?.rejectedDonations || 0}
            </div>
            <div className="text-gray-400 text-sm">Rejected Donations</div>
          </div>
        </div>

        {/* Quantity + Times Donated */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#1E2939] p-6 rounded-xl">
            <div className="text-3xl font-bold text-[#F4C752]">
              {donorData?.stats?.totalQuantity || 0} kg
            </div>
            <div className="text-gray-400 text-sm">Total Quantity Donated</div>
          </div>
          <div className="bg-[#1E2939] p-6 rounded-xl">
            <div className="text-3xl font-bold text-[#F4C752]">
              {donorData?.stats?.timesDonated || 0}
            </div>
            <div className="text-gray-400 text-sm">Number of Times Donated</div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-[#1E2939] rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-[#F4C752] text-[#141C25] py-3 px-4 rounded-lg hover:bg-[#e6b94a] transition-colors font-medium">
              New Donation
            </button>
            <button className="bg-[#364153] text-white py-3 px-4 rounded-lg hover:bg-[#2a3444] transition-colors">
              View History
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
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
