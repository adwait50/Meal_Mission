import React, { useEffect, useState } from "react";
import AdminSideBar from "../components/AdminSideBar";
import { Link, Outlet } from "react-router";
import axios from "axios";
function PendingNgos() {
  return (
    <div className="min-h-screen bg-[#141C25] flex text-white">
      <AdminSideBar />
      <div className="flex-1 ">
        <Outlet />
      </div>
    </div>
  );
}

export default PendingNgos;
