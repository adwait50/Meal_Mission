// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
// start
import React, { useState } from "react";

const App = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setaddress] = useState("");
  const [otp, setotp] = useState("");
  const [documentProof, setDocumentProof] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    ngoName: "",
    email: "",
    password: "",
    address: "",
    document: null,
    acceptTerms: false,
  });
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: e.target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, document: file }));
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
    setFormData((prev) => ({ ...prev, document: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowOtpScreen(true);
    startResendTimer();
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
    if (otpValue.length !== 4) {
      setOtpError("Please enter a valid 4-digit OTP");
      return;
    }
    setIsVerifying(true);
    setOtpError("");

    // Simulate OTP verification
    setTimeout(() => {
      setIsVerifying(false);
      if (otpValue === "1234") {
        console.log("OTP verified successfully");
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    }, 1500);
  };

  const handleResendOtp = () => {
    if (resendTimer === 0) {
      setOtp(["", "", "", ""]);
      setOtpError("");
      startResendTimer();
      console.log("Resending OTP to:", formData.email);
    }
  };
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="ngoName"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  NGO Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                        showPassword ? "ri-eye-line" : "ri-eye-off-line"
                      }`}
                    ></i>
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={address}
                  onChange={(e) => setaddress(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none bg-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
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
                  onClick={() => document.getElementById("document")?.click()}
                >
                  <input
                    type="file"
                    value={documentProof}
                    onChange={(e) => setDocumentProof(e.target.value)}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                  />
                  <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                  <p className="text-sm text-gray-400">
                    {formData.document
                      ? `Selected file: ${formData.document.name}`
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
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium !rounded-button whitespace-nowrap"
              >
                Register NGO
              </button>
              <p className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  Sign in
                </a>
              </p>
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
              <div className="flex justify-center space-x-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-14 h-14 text-center text-2xl font-semibold border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-gray-700 text-white"
                  />
                ))}
              </div>
              {otpError && (
                <p className="text-red-500 text-sm text-center">{otpError}</p>
              )}
              <button
                onClick={handleVerifyOtp}
                disabled={isVerifying}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed !rounded-button whitespace-nowrap"
              >
                {isVerifying ? (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-circle-notch fa-spin mr-2"></i>
                    Verifying...
                  </span>
                ) : (
                  "Verify OTP"
                )}
              </button>
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
    </div>
  );
};
export default App;
// end
