import React from "react";
import { Route, Routes } from "react-router";
import Home from "../pages/Home";
import DonorRegister from "../pages/DonorRegister";
import DonorLogin from "../pages/DonorLogin";
import DonorHome from "../pages/DonorDashboard";
import DonorLogout from "../pages/DonorLogout";
import DonorProtectedWrapper from "../pages/DonorProtectedWrapper";
import NgoRegister from "../pages/NgoRegister";
import NgoLogin from "../pages/NgoLogin";
import DonorForgotPassword from "../pages/DonorForgotPassword";
import NgoForgotPassword from "../pages/NgoForgotPassword";
import DonorDashboard from "../pages/DonorDashboard";
import DonorDonations from "../pages/DonorDonations";
import DonorProfile from "../pages/DonorProfile";
import DonorSettings from "../pages/DonorSettings";
import { DonorProvider } from "../context/DonorContext";
import RequestPickup from "../components/template/RequestPickup";
import DonorDashboardContent from "../pages/DonorDashboardContent";
import Status from "../components/template/Status";
import DonationHistory from "../components/template/DonationHistory";

function App() {
  return (
    <div>
      <DonorProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/donor-register" element={<DonorRegister />} />
          <Route path="/donor-login" element={<DonorLogin />} />

          <Route
            path="/donor-dashboard"
            element={
              <DonorProtectedWrapper>
                <DonorDashboard />
              </DonorProtectedWrapper>
            }
          >
            <Route index element={<DonorDashboardContent />} />
            <Route path="request-pickup" element={<RequestPickup />} />
            <Route path="status" element={<Status />} />
            <Route path="donation-history" element={<DonationHistory />} />
          </Route>
          <Route
            path="/donor-donations"
            element={
              <DonorProtectedWrapper>
                <DonorDonations />{" "}
              </DonorProtectedWrapper>
            }
          />
          <Route
            path="/donor-profile"
            element={
              <DonorProtectedWrapper>
                <DonorProfile />{" "}
              </DonorProtectedWrapper>
            }
          />
          <Route
            path="/donor-setting"
            element={
              <DonorProtectedWrapper>
                <DonorSettings />{" "}
              </DonorProtectedWrapper>
            }
          />
          <Route path="/donor-logout" element={<DonorLogout />} />
          <Route
            path="/donor-forgot-password"
            element={<DonorForgotPassword />}
          />

          <Route path="/ngo-register" element={<NgoRegister />} />
          <Route path="/ngo-login" element={<NgoLogin />} />
          <Route path="/ngo-forgot-password" element={<NgoForgotPassword />} />
        </Routes>
      </DonorProvider>
    </div>
  );
}

export default App;
