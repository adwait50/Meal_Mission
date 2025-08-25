import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import NavBar from "../components/NavBar";

const App = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [timer, setTimer] = useState(300);
  const [error, setError] = useState("");

  useEffect(() => {
    if (showOTP && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showOTP, timer]);

  const HandleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/donors/register`,
        { name, email, password, phone, address }
      );
      setShowOTP(true);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/donors/verify-otp`,
      { email, otp }
    );
    if (response.status === 200) {
      setShowSuccess(true);
      navigate("/donor-dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#141C25] flex flex-col  items-center">
      <NavBar />
      <div className=" max-w-md sm:w-full sm:max-w-lg mt-10 mx-4 sm:mx-0 space-y-8 bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl mb-12" >
        <div>
          <h2 className="text-center text-xl sm:text-3xl font-extrabold text-white">
            Register as Donor
          </h2>
          <h5 className="text-center mt-2 text-gray-300 text-sm sm:text-base">
            Join Us in Making Every Meal Matter
          </h5>
        </div>

        <form
          className="space-y-5 "
          onSubmit={showOTP ? handleVerifyOtp : HandleSubmit}
        >
          {!showOTP ? (
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="text-gray-300 text-sm">
                  Full Name
                </label>
                <div className="relative mt-1">
                  <i className="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    id="name"
                    type="text"
                    required
                    className="w-full rounded-lg pl-9 pr-3 py-2 sm:py-3 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="text-gray-300 text-sm">
                  Email
                </label>
                <div className="relative mt-1">
                  <i className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    id="email"
                    type="email"
                    required
                    className="w-full rounded-lg pl-9 pr-3 py-2 sm:py-3 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="text-gray-300 text-sm">
                  Password
                </label>
                <div className="relative mt-1">
                  <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full rounded-lg pl-9 pr-10 py-2 sm:py-3 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                  </button>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="text-gray-300 text-sm">
                  Phone
                </label>
                <div className="relative mt-1">
                  <i className="fas fa-phone absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    id="phone"
                    type="tel"
                    required
                    className="w-full rounded-lg pl-9 pr-3 py-2 sm:py-3 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="text-gray-300 text-sm">
                  Address
                </label>
                <textarea
                  id="address"
                  rows={3}
                  required
                  className="w-full rounded-lg pl-3 pr-3 py-2 sm:py-3 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-300 text-center">
                Please enter the verification code sent to <span className="font-medium">{email}</span>
              </p>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full max-w-xs mx-auto rounded-lg px-3 py-3 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 sm:text-sm"
              />
              <p className="text-gray-400 text-sm text-center">
                Time remaining: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
              </p>
            </div>
          )}

          <div className="flex flex-col items-center">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg text-sm sm:text-base transition"
            >
              {showOTP ? "Verify & Submit" : "Register"}
            </button>
            {!showOTP && (
              <div className="flex text-gray-400 text-sm mt-4">
                Already have an account?
                <Link to="/donor-login" className="ml-1 text-blue-500 hover:text-blue-400">
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </form>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <i className="fas fa-check-circle text-green-500 text-4xl mb-4"></i>
            <p className="text-white text-lg">Registration Successful!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
