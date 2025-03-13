import axios from "axios";
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import Modal from "../Modal";
import PickupConfirm from "./PickupConfirm";
import { useDonor } from "../../context/DonorContext";

const App = () => {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    donorName: "",
    phone: "",
    address: "",
    foodItems: "",
    quantity: "",
    pickupDate: "",
    additionalNotes: "",
    foodImage: null,
  });

  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { donorData } = useDonor();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestId, setrequestId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, foodImage: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      formDataToSend.append("donorName", formData.donorName);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("foodItems", formData.foodItems);
      formDataToSend.append("quantity", formData.quantity);
      formDataToSend.append("pickupDate", formData.pickupDate);
      formDataToSend.append("additionalNotes", formData.additionalNotes);

      if (formData.foodImage) {
        formDataToSend.append("foodImage", formData.foodImage);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/pickup/request-pickup`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        // console.log(response.data.requestId);
        const requestId = response.data.requestId;
        setrequestId(requestId);
        setSuccess(true);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error submitting pickup request:", error);
      console.log(error.response?.data);
      setError(
        error.response?.data?.message || "Failed to submit pickup request"
      );
      setSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141C25] py-9 px-4 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate("/donor-dashboard")}
        className="mb-4 text-gray-400 hover:text-white flex items-center gap-2"
      >
        ← Back to Dashboard
      </button>
      <div className="max-w-4xl mt-6 mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-8">
            New Food Donation Form
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Donor Name
                </label>
                <input
                  type="text"
                  name="donorName"
                  value={formData.donorName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border-none rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter donor name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border-none rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border-none rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter pickup address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Food Items
              </label>
              <textarea
                name="foodItems"
                value={formData.foodItems}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-gray-700 border-none rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
                placeholder="List the food items you wish to donate"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quantity (kg)
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border-none rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter quantity in kg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pickup Date
                </label>
                <input
                  type="date"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border-none rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Food Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full bg-gray-700 border-none rounded-lg px-4 py-2.5 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-gray-900 hover:file:bg-yellow-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Additional Notes
              </label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-gray-700 border-none rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
                placeholder="Any special instructions or notes"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <div className="flex justify-center gap-8 space-x-4">
              <button
                type="button"
                className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer"
                onClick={() => {
                  setFormData({
                    donorName: "",
                    phone: "",
                    address: "",
                    foodItems: "",
                    quantity: "",
                    pickupDate: "",
                    additionalNotes: "",
                    foodImage: null,
                  });
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-yellow-500 text-gray-900 font-medium rounded-lg hover:bg-yellow-600 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer"
              >
                Submit Donation
              </button>
            </div>
          </form>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <PickupConfirm requestId={requestId} />
      </Modal>
    </div>
  );
};

export default App;
