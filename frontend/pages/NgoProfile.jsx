import React from "react";
import NgoSideBar from "../components/NgoSidebar";

function NgoProfile() {
  return (
    <div className="min-h-screen bg-[#141C25] flex text-white">
      <NgoSideBar />
      <div className="flex-1 ml-[300px]">Profile</div>
    </div>
  );
}

export default NgoProfile;
