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
      case "Accepted":
        return "bg-blue-600";
      case "In Progress":
        return "bg-orange-500";
      default:
        return "bg-gray-600";
    }
  };

  // Stats calculations
  const totalDonations = donations.length;
  const totalQuantity = donations.reduce((sum, donation) => sum + (donation.quantity || 0), 0);
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

        {/* Donation List */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {donations.length > 0 ? (
            donations.map((donation) => (
              <div key={donation._id} className="bg-[#1E2939] rounded-xl p-6 shadow-lg flex flex-col justify-between hover:shadow-2xl hover:bg-[#3e4b61] transition">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-white truncate">{donation.address || "No Address"}</h3>
                  <p className="text-sm text-gray-400 mt-1">ID: {donation.requestId || donation._id}</p>
                </div>

                <div className="flex flex-col gap-2 text-gray-300">
                  <p><span className="font-medium text-gray-200">Food:</span> {donation.foodItems || "N/A"}</p>
                  <p><span className="font-medium text-gray-200">Quantity:</span> {donation.quantity || "N/A"} kg</p>
                  <p><span className="font-medium text-gray-200">Status:</span> <span className={`px-2 py-1 rounded-full text-white text-xs ${getStatusClass(donation.status)}`}>{donation.status}</span></p>
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
