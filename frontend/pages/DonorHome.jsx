import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";

const DonorDashboard = () => {
  const [donorData, setDonorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonorData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/donors/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        setDonorData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching donor data:", error);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchDonorData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141C25] text-white">
        <NavBar />
        <div className="flex justify-center items-center h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#141C25] text-white">
        <NavBar />
        <div className="flex justify-center items-center h-[80vh]">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141C25] text-white">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Section */}
        <div className="bg-[#1E2939] rounded-lg shadow-xl p-6 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-blue-600 rounded-full p-4">
              <span className="text-2xl">{donorData?.name?.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{donorData?.name}</h1>
              <p className="text-gray-400">{donorData?.email}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <h3 className="text-gray-400 text-sm">Phone Number</h3>
              <p className="text-lg">{donorData?.phone}</p>
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Address</h3>
              <p className="text-lg">{donorData?.address}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#364153] p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-400">
              Total Donations
            </h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
          <div className="bg-[#364153] p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-400">NGOs Helped</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
          <div className="bg-[#364153] p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-400">
              Account Status
            </h3>
            <p className="text-3xl font-bold mt-2">
              {donorData?.isVerified ? (
                <span className="text-green-500">Verified</span>
              ) : (
                <span className="text-yellow-500">Pending</span>
              )}
            </p>
          </div>
        </div>

        {/* Recent Donations */}
        <div className="bg-[#364153] rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Donations</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    NGO
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    No donations yet
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Make New Donation
            </button>
            <button className="bg-[#364153] text-white py-3 px-4 rounded-lg hover:bg-[#2a3444] transition-colors">
              View All Donations
            </button>
          </div>
        </div>

        {/* Settings Section */}
        <div className="mt-8 bg-[#364153] rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <div className="space-y-4">
            <button className="w-full text-left px-4 py-2 hover:bg-[#2a3444] rounded-lg transition-colors">
              <i className="fas fa-user-edit mr-2"></i> Edit Profile
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-[#2a3444] rounded-lg transition-colors">
              <i className="fas fa-key mr-2"></i> Change Password
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-[#2a3444] rounded-lg transition-colors text-red-500">
              <i className="fas fa-sign-out-alt mr-2"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;