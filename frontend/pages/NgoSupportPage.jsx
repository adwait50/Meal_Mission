import React, { useState } from "react";
import NgoSideBar from "../components/NgoSidebar";
import { Link, useNavigate } from "react-router";
import axios from "axios";

const NgoSupportPage = () => {
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("Ngotoken");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ngo/support`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowSuccessModal(true);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit support request");
    }
  };

  return (
    <div className="min-h-screen bg-[#141C25] flex flex-col sm:flex-row text-white">
      {/* Sidebar */}
      <NgoSideBar />

      {/* Main content */}
      <div className="flex-1 p-4 sm:ml-[300px] pb-20 flex flex-col items-center justify-center">
        {/* Header Links */}
        <div className="flex  sm:flex-row w-full pt-3 px-1 justify-between mb-6 gap-2">
          <button
            onClick={() => navigate("/ngo-dashboard")}
            className="text-gray-400 hover:text-white flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          
          <Link
              to={"/ngo-previous-supports"}
              className="text-gray-100 hover:text-white flex items-center bg-[#364153] px-2 py-1 rounded-lg gap-2"
            >
              Previous Supports<i className="ri-ticket-line"></i>
            </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-2xl bg-slate-800/50 rounded-xl p-8 backdrop-blur-sm">
          <h1 className="text-2xl font-semibold text-white mb-8">
            Support Request Form
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              { label: "Request ID", name: "requestId", type: "text" },
              { label: "Issue", name: "issue", type: "text" },
              { label: "Phone", name: "phone", type: "tel" },
              { label: "Email", name: "email", type: "email" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-gray-200 mb-2">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                  className="w-full bg-slate-700/50 border-none text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                />
              </div>
            ))}

            {/* Description */}
            <div>
              <label className="block text-gray-200 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Please describe your issue in detail"
                className="w-full bg-slate-700/50 border-none text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none resize-none"
              />
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
              <button
                type="submit"
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-medium rounded-lg w-full sm:w-auto"
              >
                Submit Request
              </button>
              <button
                type="button"
                className="px-6 py-3 text-gray-300 bg-slate-700 hover:bg-slate-600 rounded-lg w-full sm:w-auto"
                onClick={() =>
                  setFormData({ requestId: "", issue: "", phone: "", email: "", description: "" })
                }
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm p-4 z-50">
            <div className="bg-slate-800 p-8 rounded-xl max-w-md w-full">
              <h3 className="text-xl font-semibold text-white mb-4">Request Submitted</h3>
              <p className="text-gray-300 mb-6">
                Your support request has been successfully submitted. We will contact you shortly.
              </p>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setFormData({ requestId: "", issue: "", phone: "", email: "", description: "" });
                }}
                className="w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-medium rounded-lg"
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

export default NgoSupportPage;
