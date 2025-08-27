// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

const App = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/donors/login`,
        { email, password }
      );

      localStorage.removeItem("token");
      localStorage.setItem("token", response.data.token);

      navigate("/donor-dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Invalid email or password.");
    }
  };

  useEffect(() => {
    localStorage.getItem("token");
  }, []);

  return (
    <div className="min-h-screen bg-[#141C25] flex flex-col">
      <NavBar />
      <div className="flex flex-1 items-center justify-center px-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-[#1E2939] text-white rounded-lg shadow-xl p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-sm sm:text-base">
              Sign in to continue your journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submitHandler} className="space-y-5 sm:space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-300"
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                name="email"
                className="w-full mt-2 bg-[#364153] text-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-300"
              >
                Password
              </label>
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  name="password"
                  className="w-full bg-[#364153] text-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={`fas ${
                      showPassword ? "ri-eye-line" : "ri-eye-off-line"
                    } text-gray-400 cursor-pointer`}
                  ></i>
                </button>
              </div>
            </div>

            {/* Remember me + Forgot */}
            <div className="flex flex-col flex-row items-center justify-between gap-3 sm:gap-0">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-300"
                >
                  Remember me
                </label>
              </div>
              <Link to={"/donor-forgot-password"}>
                <button
                  type="button"
                  className="text-sm text-blue-500 hover:text-blue-400"
                >
                  Forgot Password?
                </button>
              </Link>
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="text-red-500 text-center text-sm sm:text-base">
                {errorMessage}
              </div>
            )}

            {/* Sign In */}
            <button
              type="submit"
              className="w-full py-2 sm:py-3 px-4 border border-transparent text-sm sm:text-base font-medium text-white rounded-md bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </button>
          </form>

          {/* Sign Up */}
          <div className="mt-6 text-center">
            <p className="text-xs sm:text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                to={"/donor-register"}
                className="font-medium text-blue-500 hover:text-blue-400"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
