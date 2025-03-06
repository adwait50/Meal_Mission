// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
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
      console.error("Email and password are required.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/donors/login`,
        { email, password }
      );
      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem("token", data.token);
        setErrorMessage("");
      }
      navigate("/donor-home");
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-[#141C25]  ">
      <NavBar />
      <div className="max-w-md mx-auto bg-[#1E2939] text-white mt-15 rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold  mb-2">Welcome Back</h2>
          <p className="">Sign in to continue your journey</p>
        </div>

        <form onSubmit={(e) => submitHandler(e)} className="space-y-6">
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
              className="w-full mt-2 bg-[#364153] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-300"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                name="password"
                className="w-full bg-[#364153] flex mt-2 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="flex items-center justify-between">
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
          {errorMessage && (
            <div className="text-red-500 text-center mb-4">{errorMessage}</div>
          )}
          <button
            type="submit"
            className="!rounded-button w-full py-3 px-4 border border-transparent text-sm font-medium text-white rounded-md bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign In
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-zinc-400">
            Don't have an account?{" "}
            <Link
              to={"/donor-register"}
              className=" text-blue-600 hover:text-blue-400"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default App;
