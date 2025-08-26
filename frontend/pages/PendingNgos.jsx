import React from "react";
import AdminSideBar from "../components/AdminSideBar";
import { Outlet } from "react-router";

function PendingNgos() {
  return (
    <div className="min-h-screen bg-[#141C25] flex flex-col md:flex-row text-white">
      {/* Sidebar: Desktop left, Mobile bottom */}
      <AdminSideBar />

      {/* Main content */}
      <div className="flex-1 md:ml-[300px] mb-[70px] md:mb-0 p-4">
        <Outlet />
      </div>
    </div>
  );
}

export default PendingNgos;
