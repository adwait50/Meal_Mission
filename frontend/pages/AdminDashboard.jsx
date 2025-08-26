import React from "react";
import AdminSideBar from "../components/AdminSideBar";
import { Outlet } from "react-router";

function AdminHome() {
  return (
    <div className="min-h-screen bg-[#141C25] flex flex-col md:flex-row text-white">
      {/* Sidebar: On desktop it's left, on mobile it's bottom */}
      <AdminSideBar />

      {/* Main content area */}
      <div className="flex-1 md:ml-[300px] mb-[70px] md:mb-0">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminHome;
