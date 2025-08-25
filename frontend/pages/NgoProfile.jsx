import React, { useState } from "react";
import NgoSideBar from "../components/NgoSidebar";
import { Link } from "react-router";
import { useNgo } from "../context/NgoContext";
import Modal from "../components/Modal";
import ConfirmLogout from "../components/template/ConfirmLogout";

const App = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { ngoData, loading } = useNgo();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-[#141C25] flex flex-col sm:flex-row text-white">
      {/* Sidebar */}
      <NgoSideBar />

      {/* Main content */}
      <div className="flex-1 p-4 sm:p-8 mt-4 sm:mt-0  sm:ml-[300px]">
        {/* NGO Info */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">{ngoData?.name}</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-gray-400 mb-2">Total Donations</h3>
            <p className="text-3xl sm:text-4xl font-bold">$125,750</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-gray-400 mb-2">Lives Impacted</h3>
            <p className="text-3xl sm:text-4xl font-bold">2,547</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-gray-400 mb-2">Account Status</h3>
            <p className="text-emerald-400 text-xl sm:text-2xl font-semibold">
              Verified
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg whitespace-nowrap w-full">
            Start New Campaign
          </button>
          <button className="bg-slate-700 hover:bg-slate-600 text-white py-3 px-6 rounded-lg whitespace-nowrap w-full">
            View All Donations
          </button>
        </div>

        {/* Account Settings */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">Account Settings</h2>
          <div className="space-y-4">
            <button className="w-full text-left px-4 py-3 hover:bg-slate-700 rounded-lg flex items-center">
              Edit Profile
            </button>
            <button
              className="w-full text-left px-4 py-3 hover:bg-slate-700 rounded-lg flex items-center"
              onClick={() => setShowPasswordModal(true)}
            >
              Change Password
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full text-left px-4 py-3 hover:bg-slate-700 rounded-lg flex items-center text-red-400"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Change Password</h3>
              <input
                type="password"
                placeholder="Current Password"
                className="w-full bg-slate-700 border-none rounded-lg p-3 mb-4"
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full bg-slate-700 border-none rounded-lg p-3 mb-4"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full bg-slate-700 border-none rounded-lg p-3 mb-6"
              />
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 text-gray-400 hover:text-white cursor-pointer"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg cursor-pointer">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logout Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ConfirmLogout type={"ngo"} />
        </Modal>
      </div>
    </div>
  );
};

export default App;
