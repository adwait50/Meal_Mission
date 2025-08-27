// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
// start
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import NavBar from "../components/NavBar";

const App = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setemailError] = useState("");
  const [otpError, setotpError] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/donors/forgot-password`,
        { email }
      );
      if (response.status === 200) {
        setShowOTP(true);
        startTimer();
      }
    } catch (error) {
      setemailError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/donors/verify-reset-otp`,
        { email, otp }
      );
      if (response.status === 200) {
        setShowOTP(false);
        setShowNewPassword(true);
      }
    } catch (error) {
      setotpError(error.response?.data?.message || "Invalid OTP");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/donors/reset-password`,
        { email, otp, newPassword }
      );
      if (response.status === 200) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setEmail("");
          setNewPassword("");
          setConfirmPassword("");
          setShowNewPassword(false);
          setOtp("");
          navigate("/donor-login");
        }, 2000);
      }
    } catch (error) {
      setpasswordError(error.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#141C25] flex flex-col items-center px-4">
      <NavBar />
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mt-10 space-y-8 bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl">
        <div>
          <h2 className="mt-4 text-center text-2xl sm:text-3xl font-extrabold text-white">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-xs sm:text-sm text-gray-400">
            {!showOTP && !showNewPassword
              ? "Enter your email to reset password"
              : showOTP
              ? "Enter verification code"
              : "Create new password"}
          </p>
        </div>

        {/* Step 1: Email */}
        {!showOTP && !showNewPassword && (
          <form className="mt-6 space-y-6" onSubmit={handleSendOTP}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <i className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  id="email"
                  type="email"
                  required
                  className="appearance-none rounded-lg block w-full pl-10 pr-3 py-3 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            {emailError && (
              <div className="text-red-500 text-center text-sm">
                {emailError}
              </div>
            )}
            <button
              type="submit"
              className="rounded-lg w-full py-3 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              disabled={loading}
            >
              {loading ? "Loading..." : "Send Reset Code"}
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {showOTP && (
          <form className="mt-6 space-y-6" onSubmit={handleVerifyOTP}>
            <div className="space-y-4">
              <p className="text-sm text-gray-300 text-center">
                Please enter the verification code sent to {email}
              </p>
              <div className="flex justify-center">
                <input
                  type="text"
                  value={otp}
                  placeholder="Enter OTP"
                  className="w-full sm:w-3/4 h-10 text-center rounded-lg border border-gray-700 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <div className="text-center text-sm">
                <span className="text-gray-400">Time remaining: {timer}s</span>
                {timer === 0 && (
                  <button
                    type="button"
                    className="ml-2 text-blue-500 hover:text-blue-400"
                    onClick={() => {
                      setTimer(60);
                      startTimer();
                    }}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
            {otpError && (
              <div className="text-red-500 text-center text-sm">{otpError}</div>
            )}
            <button
              type="submit"
              className="rounded-lg w-full py-3 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Verify Code
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {showNewPassword && (
          <form className="mt-6 space-y-6" onSubmit={handleResetPassword}>
            <div className="space-y-4">
              {errorMessage && (
                <p className="text-red-500 text-sm text-center">
                  {errorMessage}
                </p>
              )}
              {passwordError && (
                <p className="text-red-500 text-sm text-center">
                  {passwordError}
                </p>
              )}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  New Password
                </label>
                <div className="relative">
                  <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    className="appearance-none rounded-lg block w-full pl-10 pr-10 py-3 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i
                      className={`fas ${
                        showPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    ></i>
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="appearance-none rounded-lg block w-full pl-10 pr-10 py-3 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    <i
                      className={`fas ${
                        showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    ></i>
                  </button>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="rounded-lg w-full py-3 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Reset Password
            </button>
          </form>
        )}

        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-xs sm:max-w-sm flex flex-col items-center">
              <i className="fas fa-check-circle text-green-500 text-4xl mb-4"></i>
              <p className="text-white text-center text-base sm:text-lg">
                Password Reset Successful!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
