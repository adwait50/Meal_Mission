import React from "react";
import AdminSideBar from "../components/AdminSideBar";
import { Outlet } from "react-router";

function AdminHome() {
  return (
    <div className="min-h-screen bg-[#141C25] flex text-white">
      <AdminSideBar />
      <div className="flex-1 ml-[300px]">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminHome;
