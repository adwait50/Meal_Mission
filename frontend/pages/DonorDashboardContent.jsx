import { Link } from "react-router-dom";

function DonorDashboardContent() {
  
  return (
    <div className="w-full flex-1 h-full flex flex-col justify-center gap-5 px-4 sm:px-6 lg:px-8 pt-4 mb-22 ">
      <Link to={"/"}>
      <div className="sm:hidden font-bold " ><i className="ri-arrow-left-line"></i> Home</div>
      </Link>
      <div className="h-[30%] flex gap-3 p-5 flex-col justify-center px-7 rounded-2xl bg-[#364153]">
        <h1 className="text-2xl font-semibold">Request Food Pickup</h1>
        <h5 className="text-zinc-400">
          Schedule a pickup for your food donation
        </h5>
        <Link
          to="request-pickup"
          className="bg-[#F4C752] inline-block px-3 text-center w-36 py-2 text-black rounded-lg 
          transform transition-transform duration-200 font-semibold hover:scale-105"
        >
          Request Pickup
        </Link>
      </div>
      <div className="h-[30%] flex gap-3 p-5 flex-col justify-center px-7 rounded-2xl bg-[#364153]">
        <h1 className="text-2xl font-semibold">Active Requests</h1>
        <h5 className="text-zinc-400">Track your current donations requests</h5>
        <Link
          to="status"
          className="bg-[#F4C752] inline-block px-3 text-center w-36 py-2 text-black rounded-lg 
          transform transition-transform font-semibold duration-200 hover:scale-105"
        >
          View Status
        </Link>
      </div>
      <div className="h-[30%] flex gap-3 p-5 flex-col justify-center px-7 rounded-2xl bg-[#364153]">
        <h1 className="text-2xl font-semibold">Donation History</h1>
        <h5 className="text-zinc-400">View your past donations and impact</h5>
        <Link
          to="donation-history"
          className="bg-[#F4C752] inline-block px-3 text-center w-36 py-2 text-black rounded-lg 
          transform transition-transform duration-200 font-semibold hover:scale-105"
        >
          View History
        </Link>
      </div>
    </div>
  );
}

export default DonorDashboardContent;
