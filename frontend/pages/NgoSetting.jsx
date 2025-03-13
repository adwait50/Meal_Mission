import React from "react";
import NgoSideBar from "../components/NgoSidebar";

function NgoSetting() {
  return (
    <div className="min-h-screen bg-[#141C25] flex text-white">
      <NgoSideBar />
      <div className="flex-1 ml-[300px]">Settings</div>
    </div>
  );
}

export default NgoSetting;
