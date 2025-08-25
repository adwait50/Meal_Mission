import React, { useState } from "react";
import SideBar from "../components/SideBar";
import axios from "axios";
import { Link, useNavigate } from "react-router";

const App = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    requestId: "",
    issue: "",
    phone: "",
    email: "",
    description: "",
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = { ...formData };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/donors/support`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setShowSuccessModal(true);
        setError("");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to submit support request"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#141C25] flex text-white">
      <SideBar />
      
      <div className="min-h-screen flex-1 lg:ml-[300px] flex items-center justify-center p-4 pt-5 sm:p-6 md:p-8 pb-20 ">
        <div className="flex-1">
          
          {/* ✅ Top buttons stacked properly on mobile */}
          <div className="w-full flex justify-between sm:flex-row sm:items-center sm:justify-between gap-3 mb-7">
            <button
              onClick={() => navigate("/donor-dashboard")}
              className="text-gray-400 hover:text-white  flex items-center gap-2 cursor-pointer"
            >
              ← Back to Dashboard
            </button>
            <Link
              to={"/donor-previous-supports"}
              className="text-gray-100 hover:text-white flex items-center bg-[#364153] px-2 py-1 rounded-lg gap-2"
            >
              Previous Supports<i className="ri-ticket-line"></i>
            </Link>
          </div>

          {/* ✅ Form wrapper responsive */}
          <div className="w-full mx-auto max-w-2xl bg-slate-800/50 rounded-xl mb-15 z-0 p-4 sm:p-6 md:p-8 backdrop-blur-sm">
            <h1 className="text-xl sm:text-2xl font-semibold text-white mb-6">
              Support Request Form
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Inputs stay full width automatically */}
              <div>
                <label className="block text-gray-200 mb-2">Request ID</label>
                <input
                  type="text"
                  name="requestId"
                  value={formData.requestId}
                  onChange={handleInputChange}
                  className="w-full bg-slate-700/50 border-none text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                  placeholder="Enter request ID"
                />
              </div>

              <div>
                <label className="block text-gray-200 mb-2">Issue</label>
                <input
                  type="text"
                  name="issue"
                  value={formData.issue}
                  onChange={handleInputChange}
                  className="w-full bg-slate-700/50 border-none text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                  placeholder="Enter your issue"
                />
              </div>

              <div>
                <label className="block text-gray-200 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-slate-700/50 border-none text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-gray-200 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-slate-700/50 border-none text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label className="block text-gray-200 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-slate-700/50 border-none text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none resize-none"
                  placeholder="Please describe your issue in detail"
                />
              </div>

              {error && <p className="text-red-500">{error}</p>}

              {/* ✅ Buttons stacked vertically on mobile, side by side on sm+ */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                <button
                  type="button"
                  className="px-5 py-2 sm:px-6 sm:py-3 text-gray-300 bg-slate-700 hover:bg-slate-600 transition-colors duration-200 rounded-lg cursor-pointer w-full sm:w-auto"
                  onClick={() =>
                    setFormData({
                      requestId: "",
                      issue: "",
                      phone: "",
                      email: "",
                      description: "",
                    })
                  }
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 sm:px-6 sm:py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-medium transition-colors duration-200 rounded-lg cursor-pointer w-full sm:w-auto"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ✅ Modal already mobile-friendly (centered) */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-slate-800 p-6 sm:p-8 rounded-xl max-w-md w-full mx-4">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">
                Request Submitted
              </h3>
              <p className="text-gray-300 mb-6 text-sm sm:text-base">
                Your support request has been successfully submitted. We will
                contact you shortly.
              </p>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setFormData({
                    requestId: "",
                    issue: "",
                    phone: "",
                    email: "",
                    description: "",
                  });
                }}
                className="w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-medium transition-colors duration-200 rounded-lg cursor-pointer whitespace-nowrap"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
