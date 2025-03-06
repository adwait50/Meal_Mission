// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router";
import NavBar from "../components/NavBar";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showError, setshowError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/ngo/login`,
        { email, password }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setshowError(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#141C25] flex flex-col  ">
      <NavBar />
      <div className="flex justify-center items-center mt-15 ">
        <div className="w-full items-center justify-center max-w-[480px] bg-[#1E2939] backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-3">NGO Portal</h1>
            <p className="text-gray-300">
              Welcome back! Please login to your account
            </p>
          </div>

          <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
            <div>
              <label
                className="block text-gray-300 mb-2 text-sm"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#364153] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label
                className="block text-gray-300 mb-2 text-sm"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#364153] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  <i
                    className={`fas ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Remember me</span>
              </label>
              <Link to={"/ngo-forgot-password"}>
                <button
                  type="button"
                  className="text-blue-500 hover:text-blue-400 text-sm"
                >
                  Forgot Password?
                </button>
              </Link>
            </div>
            {showError && (
              <div className="text-red-500 text-center mb-4">{showError}</div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors duration-200 !rounded-button whitespace-nowrap"
            >
              Sign in
            </button>
          </form>

          <p className="text-center mt-6 text-gray-300 text-sm">
            Don't have an account?{" "}
            <Link to={"/ngo-register"}>
              <button className="text-blue-500 hover:text-blue-400">
                Sign up
              </button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
