// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
// start
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import NavBar from "../components/NavBar";
import { Country, State, City } from "country-state-city";

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
  const [resendTimer, setResendTimer] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [states, setStates] = useState(State.getStatesOfCountry("IN"));
  const [cities, setCities] = useState([]);

  const [selectedCountry, setselectedCountry] = useState("IN");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const handleStateChange = (state) => {
    setSelectedState(state);
    setCities(City.getCitiesOfState(selectedCountry, state.isoCode));
    setFormData((prev) => ({ ...prev, state: state.name }));
    console.log(state.name);
  };
  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(e.target.value); // Update selected city state
    setFormData((prev) => ({ ...prev, city }));
    // console.log(selectedCity);
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
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("state", formData.state);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("phone", formData.phone);

      if (formData.documentProof) {
        formDataToSend.append("documentProof", formData.documentProof);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ngo/register`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        const data = response.data;
        console.log(data);
      }

      setShowOtpScreen(true);
      startResendTimer();
    } catch (error) {
      console.error(error);
      console.log(error.response.data);
      setError(error.response.data.message);
    }
  };
  const HandleOptSubmit = async (e) => {
    e.preventDefault();
    const formDataOtp = new FormData();
    formDataOtp.append("email", formData.email);
    formDataOtp.append("otp", formData.otp);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ngo/verify-otp`,
        { email: formData.email, otp: formData.otp }
      );
      console.log(response.data);
      if (response.status === 200) {
        const data = response.data;
        // console.log(data);
        navigate("/ngo-dashboard");
        setisVerified(true);
      }
    } catch (error) {
      console.error(error.response.data.message);
      setOtpError(error.response.data.message);
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

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }
    setIsVerifying(true);
    setOtpError("");

    setTimeout(() => {
      setIsVerifying(false);
      if (otpValue === "123456") {
        console.log("OTP verified successfully");
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    }, 1500);
  };

  const handleResendOtp = () => {
    if (resendTimer === 0) {
      setOtp(["", "", "", "", "", ""]);
      setOtpError("");
      startResendTimer();
      console.log("Resending OTP to:", formData.email);
    }
  };
  return (
    <div className="min-h-screen bg-gray-900 ">
      <NavBar />
      {!showOtpScreen ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                NGO Registration
              </h1>
              <p className="text-gray-400">
                Complete the form below to register your NGO
              </p>
            </div>
            <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  NGO Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-gray-700 text-white placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <i
                      className={`fas ${
                        showPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    ></i>
                  </button>
                </div>
              </div>
              <div className="flex justify-between gap-1  w-full ">
                <div className="w-1/2 ">
                  <label htmlFor="State" className="text-zinc-300 text-sm">
                    State
                  </label>
                  <div className="relative mt-1">
                    <select
                      name="state"
                      id="state"
                      className="w-full rounded-lg relative block  pl-10 pr-3 py-3 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                      onChange={(e) =>
                        handleStateChange(
                          states.find((s) => s.isoCode === e.target.value)
                        )
                      }
                    >
                      <option className="w-full" value="">
                        Select State
                      </option>
                      {states.map((state) => (
                        <option key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="w-1/2 ">
                  <label htmlFor="city" className="text-zinc-300 text-sm">
                    City
                  </label>
                  <div className="relative mt-1">
                    <select
                      disabled={!selectedState}
                      name="city"
                      onChange={handleCityChange}
                      className="w-full rounded-lg relative block  pl-10 pr-3 py-3 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
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
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none bg-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Upload
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
${
  isDragging
    ? "border-blue-500 bg-gray-700"
    : "border-gray-600 hover:border-blue-500"
}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() =>
                    document.getElementById("documentProof")?.click()
                  }
                >
                  <input
                    type="file"
                    id="documentProof"
                    name="documentProof"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                  />
                  <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                  <p className="text-sm text-gray-400">
                    {formData.documentProof
                      ? `Selected file: ${formData.documentProof.name}`
                      : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: PDF, DOC, DOCX
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
                <label
                  htmlFor="acceptTerms"
                  className="ml-2 block text-sm text-gray-300"
                >
                  I agree to the{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Terms and Conditions
                  </a>
                </label>
              </div>
              {error && (
                <div className="text-red-500 text-center mb-4">{error}</div>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium !rounded-button whitespace-nowrap"
              >
                Register NGO
              </button>
              <div className="flex justify-center items-center">
                <p className="text-center text-sm text-gray-400">
                  Already have an account?{" "}
                </p>
                <Link
                  className="text-blue-600 hover:text-blue-800"
                  to={"/ngo-login"}
                >
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Verify Your Email
              </h1>
              <p className="text-gray-400">
                We've sent a verification code to
                <br />
                <span className="font-medium">{formData.email}</span>
              </p>
            </div>
            <div className="space-y-6">
              <form onSubmit={(e) => HandleOptSubmit(e)}>
                {otpError && (
                  <p className="text-red-500 text-sm text-center">{otpError}</p>
                )}
                <div className="flex justify-center space-x-3">
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    placeholder="OTP"
                    className="appearance-none text-center rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full mt-7 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed !rounded-button whitespace-nowrap"
                >
                  Verify OTP
                </button>
              </form>
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium !rounded-button whitespace-nowrap"
                >
                  {resendTimer > 0
                    ? `Resend code in ${resendTimer}s`
                    : "Resend code"}
                </button>
              </div>
              <button
                onClick={() => setShowOtpScreen(false)}
                className="w-full text-gray-400 hover:text-gray-200 text-sm font-medium !rounded-button whitespace-nowrap"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to registration
              </button>
            </div>
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
