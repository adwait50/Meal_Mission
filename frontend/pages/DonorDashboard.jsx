import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import { useDonor } from "../context/DonorContext";

const DonorDashboard = () => {
  const { donorData, loading, error, fetchDonorData } = useDonor();

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#141C25] flex text-white">
      <SideBar />
      <div className="flex-1 ml-[300px]">
        <Outlet />
      </div>
    </div>
  );
};

export default DonorDashboard;
