import React, { useState } from "react";
import { Link } from "react-router";

function NavBar() {
  const [open, setOpen] = useState(false);
  const navComp = ["About", "Donor", "NGOs", "Stories", "Get Started"];

  return (
    <nav className="flex justify-between items-center w-full text-white py-4 px-6 md:px-14 border-b-2 border-[#1A2432]">
      {/* Logo */}
      <Link
        to={"/"}
        className="font-bold text-xl md:text-2xl hover:scale-105 transition-transform duration-200"
      >
        Meal Mission
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-6 text-lg">
        {navComp.map((e, i) => (
          <h4
            key={i}
            className="relative inline-block group transform transition-transform duration-200 hover:scale-105"
          >
            {e}
            <span className="absolute left-0 bottom-[-2px] w-full h-0.5 bg-white transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
          </h4>
        ))}
        <div className="flex gap-3 font-semibold">
          <Link to={"/donor-login"}>
            <button className="bg-[#F4C752] text-[#141C25] px-3 py-2 rounded-xl hover:scale-105 transition-transform">
              Donor
            </button>
          </Link>
          <Link to={"/ngo-login"}>
            <button className="bg-[#1C2B36] px-3 py-2 rounded-xl hover:scale-105 transition-transform">
              NGO
            </button>
          </Link>
        </div>
      </div>

      {/* Mobile hamburger */}
      <button
  onClick={() => setOpen(!open)}
  className="md:hidden text-3xl focus:outline-none"
>
  ☰
</button>

{/* Mobile menu */}
<div
  className={`absolute top-16 left-0 w-full bg-[#1A2430] rounded-b-2xl shadow-lg flex flex-col items-center gap-6 py-6 md:hidden z-50 transform transition-all duration-300 ease-in-out ${
    open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5 pointer-events-none"
  }`}
>
  <Link to={"/"} className="text-lg sm:hidden">
    Home
  </Link>
  {navComp.map((e, i) => (
    <h4 key={i} className="text-lg">
      {e}
    </h4>
  ))}
  <Link to={"/donor-dashboard"}>
    <button className="bg-[#F4C752] text-[#141C25] px-4 py-2 rounded-xl w-32 shadow-md hover:brightness-110 transition">
      Donor
    </button>
  </Link>
  <Link to={"/ngo-dashboard"}>
    <button className="bg-[#243447] text-white px-4 py-2 rounded-xl w-32 shadow-md hover:bg-[#2e3f52] transition">
      NGO
    </button>
  </Link>
</div>

    </nav>
  );
}

export default NavBar;
