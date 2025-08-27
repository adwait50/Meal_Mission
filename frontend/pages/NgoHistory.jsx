import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NgoSideBar from "../components/NgoSidebar";

const DonationHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("Ngotoken");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/ngo/donation-history`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
          setDonations(response.data.donationHistory || []);
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
        return "bg-green-600";
      case "Rejected":
        return "bg-red-600";
      case "Cancelled":
        return "bg-gray-500";
      case "Accepted":
        return "bg-blue-600";
      case "In Progress":
        return "bg-orange-500";
      default:
        return "bg-gray-600";
    }
  };

  // Date formatting function (only date, no time)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Stats calculations
  const totalDonations = donations.length;
  const totalQuantity = donations.reduce(
    (sum, donation) => sum + (donation.quantity || 0),
    0
  );
  const timesDonated = donations.length;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#141C25] text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141C25] flex text-white">
      <NgoSideBar />
      <div className="flex-1 p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/ngo-dashboard")}
          className="mb-4 text-gray-400 hover:text-white flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>

        <h2 className="text-3xl font-semibold mb-6 text-zinc-100">
          Donation History
        </h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1E2939] p-6 rounded-xl shadow-lg">
            <h3 className="text-lg text-gray-300 mb-2">Total Donations</h3>
            <p className="text-2xl font-bold text-green-400">{totalDonations}</p>
          </div>
          <div className="bg-[#1E2939] p-6 rounded-xl shadow-lg">
            <h3 className="text-lg text-gray-300 mb-2">Total Quantity</h3>
            <p className="text-2xl font-bold text-blue-400">{totalQuantity} kg</p>
          </div>
          <div className="bg-[#1E2939] p-6 rounded-xl shadow-lg">
            <h3 className="text-lg text-gray-300 mb-2">Number of Times Donated</h3>
            <p className="text-2xl font-bold text-purple-400">{timesDonated}</p>
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
                      <Link to={`/ngo-dashboard/donation/${donation._id}`}>
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

        {/* Donation List */}
        <div className="grid gap-6 sm:hidden md:grid-cols-2 lg:grid-cols-3">
          {donations.length > 0 ? (
            donations.map((donation) => (
              <div
                key={donation._id}
                className="bg-[#1E2939] rounded-xl p-6 shadow-lg flex flex-col justify-between hover:shadow-2xl hover:bg-[#3e4b61] transition"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-white truncate">
                    {donation.address || "No Address"}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    ID: {donation.requestId || donation._id}
                  </p>
                </div>

                <div className="flex flex-col gap-2 text-gray-300">
                  <p>
                    <span className="font-medium text-gray-200">Food:</span>{" "}
                    {donation.foodItem || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium text-gray-200">Quantity:</span>{" "}
                    {donation.quantity || "N/A"} kg
                  </p>
                  <p>
                    <span className="font-medium text-gray-200">Pickup Date:</span>{" "}
                    {formatDate(donation.pickupDate)}
                  </p>
                  <p>
                    <span className="font-medium text-gray-200">Requested On:</span>{" "}
                    {formatDate(donation.createdAt)}
                  </p>
                  <p>
                    <span className="font-medium text-gray-200">Status:</span>{" "}
                    <span
                      className={`px-2 py-1 rounded-full text-white text-xs ${getStatusClass(
                        donation.status
                      )}`}
                    >
                      {donation.status}
                    </span>
                  </p>
                </div>

                <Link
                  to={`/ngo-dashboard/donation/${donation._id}`}
                  className="mt-4 inline-block text-yellow-500 border border-yellow-500 text-sm px-3 py-1 rounded-md hover:bg-yellow-500 hover:text-black transition text-center"
                >
                  View Details
                </Link>
              </div>
            ))
          ) : (
            <p className="text-red-500 col-span-full">No donations found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationHistory;
