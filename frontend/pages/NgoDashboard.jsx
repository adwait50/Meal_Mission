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
    <div className="min-h-screen bg-[#141C25] flex text-white">
      <NgoSideBar />
      <div className="flex-1 ml-[300px]">
        <Outlet />
      </div>
    </div>
  );
};

export default NgoDashboard;
