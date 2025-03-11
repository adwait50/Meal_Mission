import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

const DonorLayout = () => {
  return (
    <div className="min-h-screen bg-[#141C25] text-white">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* This is where the child routes (dashboard, donations, etc.) will render */}
        <Outlet />
      </div>
    </div>
  );
};

export default DonorLayout;
