// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";

const App = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/donors/active-requests`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          console.log(response.data);
          setDonations(response.data);
          setFilteredDonations(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchActiveRequests();
  }, []);

  // Filter donations based on selected status
  useEffect(() => {
    if (selectedStatus === "all") {
      setFilteredDonations(donations);
    } else {
      const filtered = donations.filter(
        (donation) => donation.status.toLowerCase() === selectedStatus.toLowerCase()
      );
      setFilteredDonations(filtered);
    }
  }, [selectedStatus, donations]);

  const getStatusClass = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-green-600";
      case "Scheduled":
        return "bg-blue-600";
      case "Pending":
        return "bg-orange-400 ";
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
      <div className="max-w-6xl mt-9 mx-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-3xl font-semibold text-zinc-100">
            Active Requests
          </h2>
          
          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-3">
            <label className="text-zinc-300 text-sm font-medium">Filter by Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#364153] text-white px-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-[#F4C752] focus:outline-none"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-zinc-400">
            Showing {filteredDonations.length} of {donations.length} requests
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Donation ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Items
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
                {filteredDonations.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-zinc-400">
                      {selectedStatus === "all" 
                        ? "No active requests found" 
                        : `No ${selectedStatus} requests found`
                      }
                    </td>
                  </tr>
                ) : (
                  filteredDonations.map((donation, index) => (
                    <tr
                      key={donation.id}
                      className={`
                        border-b border-gray-700 hover:bg-gray-700/50 transition-colors
                        
                      `}
                    >
                      <td className="px-6 py-4  text-sm text-white">
                        {donation.requestId}
                      </td>
                      <td className="px-6 py-4 text-sm  text-white">
                        {donation.foodItems.slice(0, 40)}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {donation.quantity}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {donation.createdAt}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`
                          px-3 py-1 text-xs font-medium rounded-full text-white
                          ${getStatusClass(donation.status)}
                        `}
                        >
                          {donation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/donor-dashboard/status/${donation._id }`}
                        >
                          <i className="ri-eye-line cursor-pointer"></i>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
