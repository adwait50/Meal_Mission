import React, { useState } from "react";
import SideBar from "../components/SideBar";
import axios from "axios";
import { useNavigate } from "react-router";
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
      const token = localStorage.getItem("Ngotoken");

      const formDataToSend = new FormData();
      formDataToSend.append("requestId", formData.requestId);
      formDataToSend.append("issue", formData.issue);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("description", formData.description);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/donors/support`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error submitting support request:", error);
      setError(
        error.response?.data?.message || "Failed to submit support request"
      );
    }
  };

  return (
    <div className="min-h-screen  bg-[#141C25] flex  text-white">
      <SideBar />
      <div className="min-h-screen flex-1 ml-[300px]  flex items-center justify-center p-4">
        <div className="flex-1  ">
          <button
            onClick={() => navigate("/donor-dashboard")}
            className="mb-4 text-gray-400 hover:text-white flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <div className="w-full main mx-auto max-w-2xl bg-slate-800/50 rounded-xl p-8 backdrop-blur-sm">
            <h1 className="text-2xl font-semibold text-white mb-8">
              Support Request Form
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-200 mb-2">Request ID</label>
                <input
                  type="text"
                  name="requestId"
                  value={formData.requestId}
                  onChange={handleInputChange}
                  className="w-full bg-slate-700/50 border-none text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
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
                  className="w-full bg-slate-700/50 border-none text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
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
                  className="w-full bg-slate-700/50 border-none text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
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
                  className="w-full bg-slate-700/50 border-none text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
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
                  className="w-full bg-slate-700/50 border-none text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none resize-none"
                  placeholder="Please describe your issue in detail"
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  className="px-6 py-3 text-gray-300 bg-slate-700 hover:bg-slate-600 transition-colors duration-200 rounded-lg cursor-pointer whitespace-nowrap"
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
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-medium transition-colors duration-200 rounded-lg cursor-pointer whitespace-nowrap"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>

        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-slate-800 p-8 rounded-xl max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-white mb-4">
                Request Submitted
              </h3>
              <p className="text-gray-300 mb-6">
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
