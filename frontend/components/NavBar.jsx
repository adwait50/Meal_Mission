import React from "react";
import { Link } from "react-router";

function NavBar() {
  const navComp = ["About", "Donor", "NGOs", "Stories", "Get Started"];
  return (
    <nav className=" flex justify-between items-center w-full text-white py-6 px-14 text-2xl border-b-[2px] border-[#1A2432] ">
      <Link
        to={"/"}
        className="hover:scale-105 transition-transform duration-200 "
      >
        <div className="font-bold">Meal Mission</div>
      </Link>
      <div className="flex text-lg items-center gap-4 ">
        <div className="flex gap-8 ">
          {navComp.map((e, i) => (
            <h4
              key={i}
              className="relative inline-block group transform transition-transform duration-200 hover:scale-115"
            >
              {e}
              <span className="absolute left-0 bottom-[-2px] w-full h-0.5 bg-white transform scale-x-0 translate-x-0 transition-transform duration-300 group-hover:scale-x-100 group-hover:translate-x-0 group-focus:scale-x-100 group-focus:translate-x-0 group-active:scale-x-100 group-active:translate-x-0"></span>
            </h4>
          ))}
        </div>
        <div className="flex mx-4 gap-3 font-semibold ">
          <Link to={"/donor-login"}>
            <button className="bg-[#F4C752] text-[#141C25] px-3 py-2 rounded-xl transform transition-transform duration-200 hover:scale-115 ">
              Donor
            </button>
          </Link>
          <Link to={"/ngo-login"}>
            <button className="bg-[#1C2B36] px-3 py-2 rounded-xl transform transition-transform duration-200 hover:scale-115 ">
              NGO
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
