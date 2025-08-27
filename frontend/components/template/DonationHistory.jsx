// DonationHistory.jsx

import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

const DonationHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timesDonated, setTimesDonated] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setLoading(false);

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/donors/donation-history`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response)
        if (response.status === 200) {
          const data = response.data;
          setDonations(data.donationHistory || []);
          setTimesDonated(data.timesDonated || 0);
          setTotalDonations(data.totalDonations || 0);
          setTotalWeight(data.totalWeight || 0);
        }
      } catch (error) {
        console.error("Error fetching donation history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-purple-600";
      case "Rejected":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#141C25] text-white">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#141C25] p-4 sm:p-8">
      <button
        onClick={() => navigate("/donor-dashboard")}
        className="mb-4 text-gray-400 hover:text-white flex items-center gap-2"
      >
        ← Back to Dashboard
      </button>

      <div className="max-w-6xl mt-2 mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-5 text-zinc-100">
          Donation History
        </h2>

        {/* Summary cards */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mt-6 sm:mt-8">
          <div className="flex h-24 w-full sm:w-1/3 gap-4 sm:gap-8 rounded-xl bg-gray-800 px-6 sm:px-12 items-center">
            <i className="fas fa-wallet text-yellow-500 text-xl"></i>
            <div>
              <div className="text-zinc-400 text-sm sm:text-base">Total Records</div>
              <span className="text-xl sm:text-2xl font-semibold">{totalDonations}</span>
            </div>
          </div>
          <div className="flex h-24 w-full sm:w-1/3 gap-4 sm:gap-8 rounded-xl bg-gray-800 px-6 sm:px-12 items-center">
            <i className="fas fa-weight text-green-500 text-xl"></i>
            <div>
              <div className="text-zinc-400 text-sm sm:text-base">Total Quantity</div>
              <span className="text-xl sm:text-2xl font-semibold">{totalWeight}</span> kg
            </div>
          </div>
          <div className="flex h-24 w-full sm:w-1/3 gap-4 sm:gap-8 rounded-xl bg-gray-800 px-6 sm:px-12 items-center">
            <i className="fas fa-hand-holding-heart text-purple-500 text-xl"></i>
            <div>
              <div className="text-zinc-400 text-sm sm:text-base">Times Donated</div>
              <span className="text-xl sm:text-2xl font-semibold">{timesDonated}</span>
            </div>
          </div>
        </div>

        {/* Table for wide screens */}
        <div className="hidden sm:block bg-gray-800 mt-6 rounded-lg shadow-xl overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Donation ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Address</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Quantity</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {donations.length > 0 ? (
                donations.map((donation, idx) => (
                  <tr
                    key={donation._id || idx}
                    className={`border-b border-gray-700 hover:bg-gray-700/50 transition-colors ${
                      idx % 2 === 0 ? "bg-gray-800" : "bg-gray-800/50"
                    }`}
                  >
                    <td className="px-4 py-2 text-white">{donation.requestId || donation._id}</td>
                    <td className="px-4 py-2 text-white">{donation.address}</td>
                    <td className="px-4 py-2 text-white">{donation.quantity}</td>
                    <td className="px-4 py-2 text-white">
                      {donation.pickupDate
                        ? new Date(donation.pickupDate).toLocaleDateString("en-GB")
                        : "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${getStatusClass(donation.status)}`}>
                        {donation.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <Link to={`/donor-dashboard/status/${donation._id}`}>
                        <i className="ri-eye-line cursor-pointer text-blue-400 hover:text-blue-300"></i>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-4 text-center text-gray-400">
                    No completed or rejected donations yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Card view for mobile */}
        <div className="sm:hidden mt-6 mb-20 space-y-4">
          {donations.length > 0 ? (
            donations.map((donation) => (
              <div
                key={donation._id}
                className="bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-700 flex flex-col gap-2"
              >
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Donation ID:</span>
                  <span className="text-white text-sm">{donation.requestId || donation._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Address:</span>
                  <span className="text-white text-sm">{donation.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Quantity:</span>
                  <span className="text-white text-sm">{donation.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Pickup Date:</span>
                  <span className="text-white text-sm">{donation.pickupDate ? new Date(donation.pickupDate).toLocaleDateString() : "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Status:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${getStatusClass(donation.status)}`}>
                    {donation.status}
                  </span>
                  <Link to={`/donor-dashboard/status/${donation._id}`}>
                    <i className="ri-eye-line cursor-pointer text-blue-400 hover:text-blue-300 ml-2"></i>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 p-4">No completed or rejected donations yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationHistory;
