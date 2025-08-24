// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

const DonationHistory = () => {
  const [donations, setDonations] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [timesDonated, setTimesDonated] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);

  useEffect(() => {
    const fetchActiveRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/donors/donation-history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (response.status === 200) {
          // console.log("Donation history response:", response.data);
          
          if (response.data.donationHistory && Array.isArray(response.data.donationHistory)) {
            const completedDonations = response.data.donationHistory.filter(
              (donation) => donation.status === "Completed"
            );
            setDonations(completedDonations);
            setTimesDonated(completedDonations.length);
            setTotalDonations(completedDonations.length);
            setTotalWeight(
              completedDonations.reduce(
                (acc, donation) => acc + (donation.quantity || 0),
                0
              )
            );
          } else {
            console.error("Invalid donation history data structure:", response.data);
            setDonations([]);
            setTimesDonated(0);
            setTotalDonations(0);
            setTotalWeight(0);
          }
        }
      } catch (error) {
        console.error("Error fetching donation history:", error);
        if (error.response) {
          console.error("Error response:", error.response.data);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchActiveRequests();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-green-600";
      case "Scheduled":
        return "bg-blue-600";
      case "Pending":
        return "bg-orange-400 ";
      case "Accepted":
        return "bg-blue-600";
      case "Completed":
        return "bg-purple-600"; // Color for completed
      default:
        return "bg-gray-600";
    }
  };

  if (loading) {
    return <p>Loading....</p>;
  }

  return (
    <div className="min-h-screen bg-[#141C25] p-8">
      <button
        onClick={() => navigate("/donor-dashboard")}
        className="mb-4 text-gray-400 hover:text-white flex items-center gap-2"
      >
        ← Back to Dashboard
      </button>
      <div className="max-w-6xl mt-2 mx-auto">
        <h2 className="text-3xl font-semibold mb-5 text-zinc-100 ">
          Donation History
        </h2>
        <div className="flex gap-5 mt-8 justify-between h-24">
          <div className="flex h-full w-[30%] gap-8 rounded-xl bg-gray-800 px-12 items-center">
            <i className="fas fa-wallet text-yellow-500 text-xl"></i>
            <div>
              <div className="text-zinc-400">Total Donations</div>
              <span className="text-2xl font-semibold">{totalDonations}</span>
            </div>
          </div>
          <div className="flex h-full w-[30%] gap-8 rounded-xl bg-gray-800 px-12 items-center">
            <i className="fas fa-weight text-green-500 text-xl"></i>
            <div>
              <div className="text-zinc-400">Total Quantity</div>
              <span className="text-2xl font-semibold">{totalWeight} </span>kg
            </div>
          </div>
          <div className="flex h-full w-[30%] gap-8 rounded-xl bg-gray-800 px-12 items-center">
            <i className="fas fa-hand-holding-heart text-purple-500 text-xl"></i>
            <div>
              <div className="text-zinc-400">Number of times donated</div>
              <span className="text-2xl font-semibold">{timesDonated}</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 mt-8 rounded-lg shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Donation ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Address
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Time
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation, index) => (
                  <tr
                    key={donation._id || donation.id || index}
                    className={`border-b border-gray-700 hover:bg-gray-700/50 transition-colors ${
                      index % 2 === 0 ? "bg-gray-800" : "bg-gray-800/50"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm text-white">
                      {donation.requestId || donation._id || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {donation.address || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {donation.quantity || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {donation.createdAt ? new Date(donation.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full text-white ${getStatusClass(
                          donation.status
                        )}`}
                      >
                        {donation.status || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/donor-dashboard/status/${donation._id || donation.id}`}
                      >
                        <i className="ri-eye-line cursor-pointer text-blue-400 hover:text-blue-300"></i>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationHistory;
