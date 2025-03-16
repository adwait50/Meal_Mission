import React, { useState } from "react";
import NgoSideBar from "../components/NgoSidebar";
import { Link } from "react-router";

const App = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#141C25] flex text-white">
      <NgoSideBar />

      <div className="min-h-screen flex-1 ml-[300px] bg-[#141C25] text-white p-8">
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">Hope Foundation</h1>
          <p className="text-gray-400 mb-4">hopefoundation@ngo.org</p>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-gray-400 mb-1">Phone Number</p>
              <p>+1 (555) 123-4567</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Address</p>
              <p>123 Charity Lane, Compassion City</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-gray-400 mb-2">Total Donations</h3>
            <p className="text-4xl font-bold">$125,750</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-gray-400 mb-2">Lives Impacted</h3>
            <p className="text-4xl font-bold">2,547</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-gray-400 mb-2">Account Status</h3>
            <p className="text-emerald-400 text-xl font-semibold">Verified</p>
          </div>
        </div>

        {/* Recent Donations */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">Recent Donations</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400">
                  <th className="pb-4">DATE</th>
                  <th className="pb-4">DONOR</th>
                  <th className="pb-4">AMOUNT</th>
                  <th className="pb-4">STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-700">
                  <td className="py-4">Mar 15, 2025</td>
                  <td>Emily Thompson</td>
                  <td>$2,500</td>
                  <td>
                    <span className="text-emerald-400">Completed</span>
                  </td>
                </tr>
                <tr className="border-t border-slate-700">
                  <td className="py-4">Mar 14, 2025</td>
                  <td>Michael Chen</td>
                  <td>$1,000</td>
                  <td>
                    <span className="text-emerald-400">Completed</span>
                  </td>
                </tr>
                <tr className="border-t border-slate-700">
                  <td className="py-4">Mar 13, 2025</td>
                  <td>Sarah Williams</td>
                  <td>$3,000</td>
                  <td>
                    <span className="text-emerald-400">Completed</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg whitespace-nowrap cursor-pointer">
            Start New Campaign
          </button>
          <button className="bg-slate-700 hover:bg-slate-600 text-white py-3 px-6 rounded-lg whitespace-nowrap cursor-pointer">
            View All Donations
          </button>
        </div>

        {/* Account Settings */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6">Account Settings</h2>
          <div className="space-y-4">
            <button className="w-full text-left px-4 py-3 hover:bg-slate-700 rounded-lg cursor-pointer flex items-center">
              Edit Profile
            </button>
            <button
              className="w-full text-left px-4 py-3 hover:bg-slate-700 rounded-lg cursor-pointer flex items-center"
              onClick={() => setShowPasswordModal(true)}
            >
              Change Password
            </button>
            <Link to="/ngo-logout">
              <button className="w-full text-left px-4 py-3 hover:bg-slate-700 rounded-lg cursor-pointer flex items-center text-red-400">
                Logout
              </button>
            </Link>
          </div>
        </div>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
      </div>
    </div>
  );
};

export default App;
