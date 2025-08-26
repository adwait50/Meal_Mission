import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router";

const App = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", backend: "" });
  const [showError, setShowError] = useState(false);

  const validateForm = () => {
    const newErrors = { email: "", password: "", backend: "" };
    let isValid = true;

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setShowError(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/admin/login`,
        { email, password }
      );

      localStorage.setItem("Admintoken", response.data.token);

      if (response.status === 200) {
        navigate("/admin-dashboard");
      }
    } catch (error) {
      setShowError(true);
      setErrors((prev) => ({
        ...prev,
        backend: error.response?.data?.message || "Login failed",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141C25] flex items-center justify-center py-8 px-3 sm:px-6 lg:px-8">
      <div className="w-full sm:max-w-md space-y-6 bg-[#1E2939] text-white p-6 sm:p-10 rounded-lg shadow-xl">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Admin Login</h2>
          <p className="mt-2 text-xs sm:text-sm">
            Welcome back! Please enter your credentials.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email field */}
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-envelope text-gray-400"></i>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border ${
                  errors.email ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
                placeholder="Email address"
              />
            </div>
            {errors.email && showError && (
              <p className="mt-2 text-xs sm:text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-lock text-gray-400"></i>
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border ${
                  errors.password ? "border-red-300" : "border-gray-300"
                } placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
                placeholder="Password"
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={`fas ${
                    showPassword ? "fa-eye-slash" : "fa-eye"
                  } text-gray-400`}
                ></i>
              </div>
            </div>
            {errors.password && showError && (
              <p className="mt-2 text-xs sm:text-sm text-red-600">
                {errors.password}
              </p>
            )}
          </div>

          {/* Backend error */}
          <div className="flex justify-center items-center">

          {errors.backend && showError && (
            <p className="mt-2 text-xs sm:text-sm text-red-600">
              {errors.backend}
            </p>
          )}
          </div>

          {/* Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg group relative w-full flex justify-center py-3 px-4 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 cursor-pointer"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-xs sm:text-sm text-gray-400">
          <p>© 2025 Admin System. All rights reserved.</p>
          <div className="mt-3 flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-2 sm:space-y-0">
            <a href="#" className="text-indigo-500 hover:text-indigo-400">
              Terms of Service
            </a>
            <a href="#" className="text-indigo-500 hover:text-indigo-400">
              Privacy Policy
            </a>
            <a href="#" className="text-indigo-500 hover:text-indigo-400">
              Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
