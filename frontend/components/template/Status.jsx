import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Return original if invalid date
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  let hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
};

const App = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActiveRequests = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/donors/active-requests`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.status === 200) {
          setDonations(res.data || []);
          setFilteredDonations(res.data || []);
        }
        console.log(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveRequests();
  }, []);

  useEffect(() => {
    if (selectedStatus === "all") {
      setFilteredDonations(donations);
    } else {
      const filtered = donations.filter(
        (d) => (d.status || "").toLowerCase() === selectedStatus.toLowerCase()
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
        return "bg-orange-400";
      default:
        return "bg-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141C25] text-white flex items-center justify-center">
        <p className="text-zinc-300">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141C25] text-white">
      <div className="relative  p-4 sm:p-6 md:p-25 pb-24">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <button
            onClick={() => navigate("/donor-dashboard")}
            className="text-gray-400 hover:text-white flex items-center gap-2 w-fit"
          >
            ← Back to Dashboard
          </button>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-zinc-300 text-sm font-medium whitespace-nowrap">
              Filter by Status:
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#364153] text-white px-3 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-[#F4C752] focus:outline-none text-sm"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
            </select>
          </div>
        </div>

        {/* Count */}
        <p className="text-zinc-400 mb-3 text-sm">
          Showing {filteredDonations.length} of {donations.length} requests
        </p>

        {/* Desktop Table */}
        <div className="hidden sm:block bg-gray-800/80 rounded-lg shadow-xl overflow-x-auto">
          <table className="min-w-[720px] w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-300">
                  Donation ID
                </th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-300">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-300">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-300">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-300">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-300">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDonations.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-zinc-400 text-sm"
                  >
                    {selectedStatus === "all"
                      ? "No active requests found"
                      : `No ${selectedStatus} requests found`}
                  </td>
                </tr>
              ) : (
                filteredDonations.map((donation) => (
                  <tr
                    key={donation._id || donation.id}
                    className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs sm:text-sm text-white">
                      {donation.requestId}
                    </td>
                    <td className="px-4 py-3 text-xs sm:text-sm text-white max-w-[280px] truncate">
                      {donation.foodItems}
                    </td>
                    <td className="px-4 py-3 text-xs sm:text-sm text-white">
                      {donation.quantity}
                    </td>
                    <td className="px-4 py-3 text-xs sm:text-sm text-white">
                      {formatDate(donation.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 text-[10px] sm:text-xs font-medium rounded-full text-white ${getStatusClass(
                          donation.status
                        )}`}
                      >
                        {donation.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/donor-dashboard/status/${donation._id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-gray-700 hover:bg-gray-600"
                      >
                        <i className="ri-eye-line text-base"></i>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden flex flex-col gap-4">
          {filteredDonations.length === 0 ? (
            <p className="text-center text-zinc-400 text-sm mt-6">
              {selectedStatus === "all"
                ? "No active requests found"
                : `No ${selectedStatus} requests found`}
            </p>
          ) : (
            filteredDonations.map((donation) => (
              <div
                key={donation._id || donation.id}
                className="bg-gray-800/80 p-4 rounded-lg shadow-md flex flex-col gap-2"
              >
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Donation ID: {donation.requestId}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-white ${getStatusClass(
                      donation.status
                    )} text-[10px]`}
                  >
                    {donation.status}
                  </span>
                </div>
                <div className="text-sm text-white font-medium truncate">
                  {donation.foodItems}
                </div>
                <div className="text-sm text-white flex justify-between">
                  <span>Quantity: {donation.quantity}</span>
                  <span>{formatDate(donation.createdAt)}</span>
                </div>
                <Link
                  to={`/donor-dashboard/status/${donation._id}`}
                  className="mt-2  text-yellow-500 border w-1/3 flex items-center justify-center border-yellow-500 text-sm px-1 py-1 rounded-md hover:bg-yellow-500 hover:text-black transition"
                >
                  View Details
                </Link>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
