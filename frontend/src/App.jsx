
import { Route, Routes } from "react-router";
import Home from "../pages/Home";
import DonorRegister from "../pages/DonorRegister";
import DonorLogin from "../pages/DonorLogin";
import DonorLogout from "../pages/DonorLogout";
import DonorProtectedWrapper from "../pages/DonorProtectedWrapper";
import NgoRegister from "../pages/NgoRegister";
import NgoLogin from "../pages/NgoLogin";
import DonorForgotPassword from "../pages/DonorForgotPassword";
import NgoForgotPassword from "../pages/NgoForgotPassword";
import DonorDashboard from "../pages/DonorDashboard";
import DonorProfile from "../pages/DonorProfile";
import { DonorProvider } from "../context/DonorContext";
import { NgoProvider } from "../context/NgoContext";
import RequestPickup from "../components/template/RequestPickup";
import DonorDashboardContent from "../pages/DonorDashboardContent";
import Status from "../components/template/Status";
import DonationHistory from "../components/template/DonationHistory";
import AdminLogin from "../pages/AdminLogin";
import NgoDashboard from "../pages/NgoDashboard";
import NgoProtectedWrapper from "../pages/NgoProtectedWrapper";
import NgoLogout from "../pages/NgoLogout";
import NgoProfile from "../pages/NgoProfile";
import RequestDetail from "../components/template/RequestDetail";
import NgoDashboardContent from "../pages/NgoDashboardContent";
import AdminProtectedWrapper from "../pages/AdminProtectedWrapper";
import AdminDashboard from "../pages/AdminDashboard";
import AdminDashboardContent from "../pages/AdminDashboardContent";
import PendingNgos from "../pages/PendingNgos";
import PendingNgosDetail from "../pages/PendingNgosDetail";
import PendingNgosContent from "../pages/PendingNgosContent";
import BrowsePickup from "../pages/NGOs/BrowsePickup";
import DonationDetail from "../pages/NGOs/DonationDetail";
import ActiveRequests from "../pages/NGOs/ActiveRequests";
import NgoHistory from "../pages/NgoHistory";
import DonorSupportPage from "../pages/DonorSupportPage";
import NgoSupportPage from "../pages/NgoSupportPage";
import AdminSupport from "../pages/AdminSupport";
import DonorPreviousSupports from "../pages/DonorPreviousSupport";
import NgoPreviousSupports from "../pages/NGOs/NgoPreviousSupport";
import AdminLogout from "../pages/AdminLogout";

function App() {
  return (
    <div>
      <NgoProvider>
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
              <Route path="status/:requestId" element={<RequestDetail />} />
              <Route path="donation-history" element={<DonationHistory />} />
            </Route>
            
            
            <Route
              path="/donor-profile"
              element={
                <DonorProtectedWrapper>
                  <DonorProfile />{" "}
                </DonorProtectedWrapper>
              }
            />
            
            <Route
              path="/donor-support"
              element={
                <DonorProtectedWrapper>
                  <DonorSupportPage />{" "}
                </DonorProtectedWrapper>
              }
            />
            <Route path="/donor-previous-supports" element={
              <DonorProtectedWrapper>
                <DonorPreviousSupports />
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
            >
              <Route index element={<NgoDashboardContent />} />
              <Route path="browse-pickup" element={<BrowsePickup />} />
              <Route path="active-requests" element={<ActiveRequests />} />
              <Route path="donation/:requestId" element={<DonationDetail />} />
              <Route path="donation-history" element={<NgoHistory />} />
            </Route>
            <Route
              path="/ngo-profile"
              element={
                <NgoProtectedWrapper>
                  <NgoProfile />{" "}
                </NgoProtectedWrapper>
              }
            />
            
            <Route
              path="/ngo-support"
              element={
                <NgoProtectedWrapper>
                  <NgoSupportPage />{" "}
                </NgoProtectedWrapper>
              }
            />
            <Route path="/ngo-previous-supports" element={
              <NgoProtectedWrapper>
                <NgoPreviousSupports />
              </NgoProtectedWrapper>
            }   />

            <Route path="/ngo-logout" element={<NgoLogout />} />
            <Route
              path="/ngo-forgot-password"
              element={<NgoForgotPassword />}
            />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-logout" element={<AdminLogout />} />
            <Route
              path="/admin-dashboard"
              element={
                <AdminProtectedWrapper>
                  <AdminDashboard />{" "}
                </AdminProtectedWrapper>
              }
            >
              <Route index element={<AdminDashboardContent />} />
            </Route>
            <Route
              path="/pending-ngos"
              element={
                <AdminProtectedWrapper>
                  <PendingNgos />
                </AdminProtectedWrapper>
              }
            >
              <Route index element={<PendingNgosContent />} />
              <Route path=":ngoId" element={<PendingNgosDetail />} />
            </Route>
            <Route
              path="/admin-support"
              element={
                <AdminProtectedWrapper>
                  <AdminSupport />{" "}
                </AdminProtectedWrapper>
              }
            ></Route>
          </Routes>
        </DonorProvider>
      </NgoProvider>
    </div>
  );
}

export default App;
