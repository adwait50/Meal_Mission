// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router";

const App = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showError, setShowError] = useState(false);

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
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
      console.log(response);
      console.log("Logged in");

      localStorage.removeItem("token");
      localStorage.setItem("token", response.data.token);

      navigate("/admin-home");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#141C25]  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#1E2939] text-white p-10 rounded-lg shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold ">Admin Login</h2>
          <p className="mt-2 text-sm">
            Welcome back! Please enter your credentials.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md -space-y-px">
            <div className="mb-4">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-envelope "></i>
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
                  } placeholder-gray-500  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
                  placeholder="Email address"
                />
              </div>
              {errors.email && showError && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div className="mb-4">
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
                  } placeholder-gray-500  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
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
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="!rounded-button group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 cursor-pointer whitespace-nowrap"
            >
              {"Sign in"}
            </button>
          </div>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© 2025 Admin System. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="text-indigo-600 hover:text-indigo-500">
              Terms of Service
            </a>
            <span>·</span>
            <a href="#" className="text-indigo-600 hover:text-indigo-500">
              Privacy Policy
            </a>
            <span>·</span>
            <a href="#" className="text-indigo-600 hover:text-indigo-500">
              Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
