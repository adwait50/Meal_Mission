import React, { useState, useEffect } from "react";
import NgoSideBar from "../../components/NgoSidebar";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useNgo } from "../../context/NgoContext";

const BrowsePickup = () => {
  const navigate = useNavigate();
  const { ngoData } = useNgo();
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("Ngotoken");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/ngo/food-pickup-requests`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setRequests(response.data);
      }
    } catch (error) {
      console.error("Error fetching pickup requests:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-[#141C25] text-white">
      {/* Sidebar */}
      <NgoSideBar />

      {/* Main Content */}
      <div className="flex-1  sm:mt-[2rem] px-12  ">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#F4C752] hover:text-[#e6b94a] transition-colors mb-6"
        >
          <span>←</span> Back
        </button>

        {/* Page Title */}
        <h1 className="text-3xl font-semibold text-zinc-200">
          Pickup Requests From Your Area
        </h1>

        {/* Requests Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {requests.length === 0 ? (
            <div className="col-span-full text-center mt-8">
              <i className="ri-information-line text-6xl text-gray-400 mb-4"></i>
              <p className="text-lg text-gray-300">
                No pickup requests found in your area.
              </p>
            </div>
          ) : (
            requests.map((request) => (
              <div
                key={request._id}
                className="bg-gray-800 rounded-xl p-6 shadow-lg flex flex-col justify-between hover:shadow-2xl hover:bg-gray-700/70 transition cursor-pointer"
                onClick={() =>
                  navigate(`/ngo-dashboard/donation/${request._id}`)
                }
              >
                {/* Address */}
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-white truncate">
                    {request.address || "No Address"}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Request ID: {request.requestId || request._id}
                  </p>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-2 text-gray-300">
                  <p>
                    <span className="font-medium text-gray-200">Food:</span>{" "}
                    {request.foodItems || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium text-gray-200">Quantity:</span>{" "}
                    {request.quantity || "N/A"} kg
                  </p>
                  <p>
                    <span className="font-medium text-gray-200">Donor:</span>{" "}
                    {request.donorName || "Unknown"}
                  </p>
                </div>

                {/* Button (Optional, for clarity on desktop) */}
                <div className="mt-6 flex justify-end sm:hidden">
                  <Link
                    to={`/ngo-dashboard/donation/${request._id}`}
                    className="bg-[#F4C752] hover:bg-[#e6b94a] text-black font-semibold px-4 py-2 rounded-lg transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-[#141C25] border-t border-gray-600 flex justify-around items-center py-2 text-white z-50">
        <Link
          to="/ngo-dashboard"
          className="flex flex-col items-center text-sm hover:text-yellow-400 transition"
        >
          <i className="ri-home-4-line text-xl"></i>
          Dashboard
        </Link>
        <Link
          to="/ngo-profile"
          className="flex flex-col items-center text-sm hover:text-yellow-400 transition"
        >
          <i className="ri-user-3-line text-xl"></i>
          Profile
        </Link>
        <Link
          to="/ngo-support"
          className="flex flex-col items-center text-sm hover:text-yellow-400 transition"
        >
          <i className="ri-questionnaire-line text-xl"></i>
          Support
        </Link>
        <button
          onClick={() => localStorage.removeItem("Ngotoken") || navigate("/")}
          className="flex flex-col items-center text-sm hover:text-red-400 transition"
        >
          <i className="ri-logout-box-r-line text-xl"></i>
          Logout
        </button>
      </div>
    </div>
  );
};

export default BrowsePickup;
