// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
// start
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import NavBar from "../components/NavBar";
import { State, City } from "country-state-city";

const App = () => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    documentProof: null,
    acceptTerms: false,
    state: "",
    city: "",
    otp: "",
    phone: "",
  });
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [states] = useState(State.getStatesOfCountry("IN"));
  const [cities, setCities] = useState([]);
  const [selectedCountry] = useState("IN");
  const [selectedState, setSelectedState] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleStateChange = (state) => {
    setSelectedState(state);
    setCities(City.getCitiesOfState(selectedCountry, state.isoCode));
    setFormData((prev) => ({ ...prev, state: state.name }));
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setFormData((prev) => ({ ...prev, city }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, documentProof: file }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    setFormData((prev) => ({ ...prev, documentProof: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    setError("");
  
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });
  
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ngo/register`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
  
      if (response.status >= 200 && response.status < 300) {
        // alert("NGO is successfully registered! Please check your email for OTP.");
        setShowOtpScreen(true);
        startResendTimer();
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Registration failed");
    } finally {
      setIsRegistering(false);
    }
  };
  

  const HandleOptSubmit = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setOtpError("");
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ngo/verify-otp`,
        { email: formData.email, otp: formData.otp }
      );

      if (response.status === 200) {
        alert("OTP verified successfully! Wait for the approval from Meal Mission team");
        setIsVerified(true);
        navigate("/ngo-dashboard");
      }
      
    } catch (error) {
      setOtpError(error?.response?.data?.message || "Invalid OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  const startResendTimer = () => {
    setResendTimer(30);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = () => {
    if (resendTimer === 0) {
      setOtp(["", "", "", "", "", ""]);
      setOtpError("");
      startResendTimer();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 px-4 sm:px-6 lg:px-8 pb-22">
      <NavBar />
      {!showOtpScreen ? (
        <div className="max-w-2xl mx-auto mt-6">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 border border-gray-700">
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                NGO Registration
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                Complete the form below to register your NGO
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm text-gray-300 mb-1">
                  NGO Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-1 sm:py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-1 sm:py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-1 sm:py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-1 sm:py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                  </button>
                </div>
              </div>
              {/* State and City */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="state" className="text-sm text-gray-300">
                    State
                  </label>
                  <select
                    id="state"
                    onChange={(e) =>
                      handleStateChange(states.find((s) => s.isoCode === e.target.value))
                    }
                    className="w-full mt-1 px-3 py-1 sm:py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label htmlFor="city" className="text-sm text-gray-300">
                    City
                  </label>
                  <select
                    id="city"
                    disabled={!selectedState}
                    onChange={handleCityChange}
                    className="w-full mt-1 px-3 py-1 sm:py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
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
                <label htmlFor="address" className="block text-sm text-gray-300 mb-1">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-1 sm:py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                />
              </div>
              {/* Document Upload */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Document Upload
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                    isDragging ? "border-blue-500 bg-gray-700" : "border-gray-600 hover:border-blue-500"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("documentProof")?.click()}
                >
                  <input
                    type="file"
                    id="documentProof"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                  />
                  <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2" />
                  <p className="text-sm text-gray-400">
                    {formData.documentProof
                      ? `Selected: ${formData.documentProof.name}`
                      : "Click or drag and drop"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supported: JPG, PNG
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Max size: 5MB
                  </p>
                </div>
              </div>
              {/* Terms */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  required
                />
                <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-300">
                  I agree to the{" "}
                  <a href="#" className="text-blue-500 hover:text-blue-700">
                    Terms and Conditions
                  </a>
                </label>
              </div>
              {/* Error */}
              {error && <div className="text-red-500 text-center text-sm">{error}</div>}
              {/* Submit */}
              <button
                type="submit"
                disabled={isRegistering}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isRegistering ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Registering...
                  </>
                ) : (
                  "Register NGO"
                )}
              </button>
              <div className="flex justify-center text-sm text-gray-400">
                <span>Already have an account?</span>
                <Link to="/ngo-login" className="ml-2 text-blue-500 hover:text-blue-700">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto mt-6">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 border border-gray-700">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Verify Your Email
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                We've sent a code to <br />
                <span className="font-medium">{formData.email}</span>
              </p>
            </div>
            <form onSubmit={HandleOptSubmit} className="space-y-6">
              {otpError && <p className="text-red-500 text-center text-sm">{otpError}</p>}
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleInputChange}
                placeholder="Enter OTP"
                className="w-full text-center px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </form>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-400">
                Didn't receive the code?
              </p>
              <button
                onClick={handleResendOtp}
                disabled={resendTimer > 0}
                className="text-blue-500 hover:text-blue-700 text-sm mt-1"
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
              </button>
            </div>
            <button
              onClick={() => setShowOtpScreen(false)}
              className="w-full mt-4 text-gray-400 hover:text-gray-200 text-sm"
            >
              <i className="fas fa-arrow-left mr-2"></i> Back to registration
            </button>
          </div>
        </div>
      )}
      {isVerified && (
        <div className="text-green-500 text-center mt-4">
          Email verified, please wait till admin approves.
        </div>
      )}
    </div>
  );
};

export default App;
// end
