import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import NgoSideBar from "../components/NgoSidebar";
import { useNgo } from "../context/NgoContext";

const NgoDashboard = () => {
  const { ngoData, loading, error, fetchNgoData } = useNgo();

  useEffect(() => {
    fetchNgoData();
  }, [fetchNgoData]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#141C25] flex text-white relative">
      {/* Sidebar / bottom nav */}
      <NgoSideBar />

      {/* Main content */}
      <div className="flex-1 ml-0 sm:ml-[300px] pb-16 sm:pb-0">
        {/* 
          pb-16 adds bottom padding on mobile so content 
          doesn't get hidden behind the bottom nav
        */}
        <Outlet />
      </div>
    </div>
  );
};

export default NgoDashboard;
