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
import PickupConfirm from "../components/template/PickupConfirm";
import AdminLogin from "../pages/AdminLogin";
import AdminHome from "../pages/AdminHome";
import NgoDashboard from "../pages/NgoDashboard";
import NgoProtectedWrapper from "../pages/NgoProtectedWrapper";
import NgoLogout from "../pages/NgoLogout";
import NgoSetting from "../pages/NgoSetting";
import NgoProfile from "../pages/NgoProfile";

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
            <Route path="request-pickup" element={<RequestPickup />}>
              <Route index element={<PickupConfirm />} />
            </Route>
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

          <Route
            path="/ngo-dashboard"
            element={
              <NgoProtectedWrapper>
                {" "}
                <NgoDashboard />{" "}
              </NgoProtectedWrapper>
            }
          />
          <Route
            path="/ngo-profile"
            element={
              <NgoProtectedWrapper>
                <NgoProfile />{" "}
              </NgoProtectedWrapper>
            }
          />
          <Route
            path="/ngo-setting"
            element={
              <NgoProtectedWrapper>
                <NgoSetting />{" "}
              </NgoProtectedWrapper>
            }
          />
          <Route path="/ngo-logout" element={<NgoLogout />} />

          <Route path="/ngo-forgot-password" element={<NgoForgotPassword />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminHome />} />
        </Routes>
      </DonorProvider>
    </div>
  );
}

export default App;
