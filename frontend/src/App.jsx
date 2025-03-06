import React from "react";
import { Route, Routes } from "react-router";
import Home from "../pages/Home";
import DonorRegister from "../pages/DonorRegister";
import DonorLogin from "../pages/DonorLogin";
import DonorHome from "../pages/DonorHome";
import DonorLogout from "../pages/DonorLogout";
import DonorProtectedWrapper from "../pages/DonorProtectedWrapper";
import NgoRegister from "../pages/NgoRegister";
import NgoLogin from "../pages/NgoLogin";
import DonorForgotPassword from "../pages/DonorForgotPassword";
import NgoForgotPassword from "../pages/NgoForgotPassword";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donor-register" element={<DonorRegister />} />
        <Route path="/donor-login" element={<DonorLogin />} />
        <Route
          path="/donor-home"
          element={
            <DonorProtectedWrapper>
              <DonorHome />{" "}
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
    </div>
  );
}

export default App;
