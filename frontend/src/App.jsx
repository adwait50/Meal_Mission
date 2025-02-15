import React from "react";
import { Route, Routes } from "react-router";
import Home from "../pages/Home";
import DonorRegister from "../pages/DonorRegister";
import DonorLogin from "../pages/DonorLogin";
import DonorHome from "../pages/DonorHome";
import DonorLogout from "../pages/DonorLogout";
import DonorProtectedWrapper from "../pages/DonorProtectedWrapper";
import NgoRegister from "../pages/NgoRegister";

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

        <Route path="ngo-register" element={<NgoRegister />} />
      </Routes>
    </div>
  );
}

export default App;
