import axios from "axios";
import  { useState } from "react";
import { useNavigate } from "react-router";
import Modal from "../Modal";
import PickupConfirm from "./PickupConfirm";
import { useDonor } from "../../context/DonorContext";
import { State, City } from "country-state-city";

const PickupForm = () => {
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
    state: "",
    city: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [states] = useState(State.getStatesOfCountry("IN"));
  const [cities, setCities] = useState([]);

  const [selectedCountry] = useState("IN");
  const [selectedState, setSelectedState] = useState("");

  const navigate = useNavigate();
  useDonor(); // donorData not used here, so only call hook

  const handleStateChange = (state) => {
    setSelectedState(state.isoCode);
    setCities(City.getCitiesOfState(selectedCountry, state.isoCode));
    setFormData((prev) => ({ ...prev, state: state.name }));
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setFormData((prev) => ({ ...prev, city }));
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({ ...prev, foodImage: e.target.files[0] }));
    }
  };

  function formatDate(daysToAdd = 0) {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

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
      console.log(response);

      if (response.status === 201) {
        setRequestId(response.data.donation.requestId);
        setIsModalOpen(true);
        setFormData({
          donorName: "",
          phone: "",
          address: "",
          foodItems: "",
          quantity: "",
          pickupDate: "",
          additionalNotes: "",
          foodImage: null,
          state: "",
          city: "",
        });
      }
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.message || "Failed to submit pickup request"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#141C25] py-6 px-4 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate("/donor-dashboard")}
        className="mb-4 text-gray-400 hover:text-white flex items-center gap-2"
      >
        ← Back to Dashboard
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-22 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6">
            New Food Donation Form
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6  ">
            {/* Donor Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Donor Name
                </label>
                <input
                  type="text"
                  name="donorName"
                  value={formData.donorName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter donor name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  State
                </label>
                <select
                  name="state"
                  value={selectedState}
                  onChange={(e) =>
                    handleStateChange(
                      states.find((s) => s.isoCode === e.target.value)
                    )
                  }
                  className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  City
                </label>
                <select
                  disabled={!selectedState}
                  name="city"
                  value={formData.city}
                  onChange={handleCityChange}
                  className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter pickup address"
                required
              />
            </div>

            {/* Food Items */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Food Items
              </label>
              <textarea
                name="foodItems"
                value={formData.foodItems}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
                placeholder="List the food items"
                required
              />
            </div>

            {/* Quantity and Pickup Date */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-6">
            {/* Quantity */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Quantity (kg)
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter quantity in kg"
                required
              />
            </div>

            {/* Pickup Date */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Pickup Date
              </label>
              <input
                type="date"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleInputChange}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
                required
                min={formatDate(0)}   
                max={formatDate(7)}   
              />
            </div>

            
          </div>


            {/* Food Image */}
            <div>
  <label className="block text-sm text-gray-300 mb-2">
    Food Image
  </label>
  <input
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    className="w-full bg-gray-700 text-white file:mr-4 file:py-2 file:px-4 
               file:rounded-lg file:border-0 file:text-sm file:font-medium 
               file:bg-yellow-500 file:text-gray-900 hover:file:bg-yellow-600"
  />
  <p className="text-xs text-gray-400 mt-1">Max size: 5MB</p>
</div>


            {/* Additional Notes */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Additional Notes
              </label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
                placeholder="Add pickup time and any other details. "
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
              <button
                type="button"
                onClick={() =>
                  navigate("/donor-dashboard")
                }
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-yellow-500 text-gray-900 font-medium rounded-lg hover:bg-yellow-600 transition"
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

export default PickupForm;
