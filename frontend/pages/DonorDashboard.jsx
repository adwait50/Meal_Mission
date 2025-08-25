import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import { useDonor } from "../context/DonorContext";

const DonorDashboard = () => {
  const { error, fetchDonorData } = useDonor();

  useEffect(() => {
    fetchDonorData();
  }, [fetchDonorData]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#141C25] flex flex-col md:flex-row text-white">
      {/* Sidebar for desktop */}
      <div className="hidden md:block">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-[300px]">
        <Outlet />
      </div>

      {/* Bottom navigation for mobile */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-20  ">
        <SideBar mobile />
      </div>
    </div>
  );
};

export default DonorDashboard;
