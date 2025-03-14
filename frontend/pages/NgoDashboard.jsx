import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import NgoSideBar from "../components/NgoSidebar";

const NgoDashboard = () => {
  return (
    <div className="min-h-screen bg-[#141C25] flex text-white">
      <NgoSideBar />
      <div className="flex-1 ml-[300px]">
        <Outlet />
      </div>
    </div>
  );
};

export default NgoDashboard;
