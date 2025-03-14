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

  useEffect(() => {
    if (showOTP && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
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
      console.log(response.data);
      setShowOTP(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/donors/verify-otp`,
      { email, otp }
    );
    if (response.status === 200) {
      console.log("otp verified");
      setShowSuccess(true);
      navigate("/donor-dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#141C25] flex flex-col items-center ">
      <NavBar />
      <div className="max-w-lg mt-12 w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Register as Donor
          </h2>
          <h5 className="text-center mt-3 text-zinc-200">
            Join Us in Making Every Meal Matter
          </h5>
        </div>

        <form
          className="mt-8 space-y-6"
          onSubmit={showOTP ? handleVerifyOtp : (e) => HandleSubmit(e)}
        >
          {!showOTP ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="text-zinc-300 text-sm  ">
                  Full Name
                </label>
                <div className="relative mt-1 ">
                  <i className="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="text-zinc-300 text-sm">
                  Email
                </label>
                <div className="relative mt-1">
                  <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="text-zinc-300 text-sm">
                  Password
                </label>
                <div className="relative mt-1">
                  <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="appearance-none rounded-lg relative block w-full pl-10 pr-10 py-3 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
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
                <label htmlFor="phone" className="text-zinc-300 text-sm">
                  Phone
                </label>
                <div className="relative mt-1">
                  <i className="fas fa-phone absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="text-zinc-300 text-sm">
                  Address
                </label>
                <div className="relative mt-1">
                  <i className="fas fa-home absolute left-3 top-3 text-gray-400"></i>
                  <textarea
                    id="address"
                    name="address"
                    required
                    rows={3}
                    className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-300 text-center">
                Please enter the verification code sent to {email}
              </p>
              <div className="flex justify-center space-x-2">
                <input
                  type="text"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="OTP"
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                />
              </div>
              <div className="text-center text-sm">
                <span className="text-gray-400">
                  Time remaining: {Math.floor(timer / 60)}:
                  {(timer % 60).toString().padStart(2, "0")}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center">
            <button
              type="submit"
              className="!rounded-button rounded group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              {showOTP ? "Verify & Submit" : "Register"}
            </button>
            {!showOTP ? (
              <div className="flex text-zinc-400 text-sm mt-6 ">
                <h3>Already have an account? </h3>
                <Link
                  to={"/donor-login"}
                  className="text-blue-600 hover:text-blue-500"
                >
                  {" "}
                  Sign in
                </Link>
              </div>
            ) : null}
          </div>
        </form>

        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center">
              <i className="fas fa-check-circle text-green-500 text-4xl mb-4"></i>
              <p className="text-white text-lg">Registration Successful!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
// end
