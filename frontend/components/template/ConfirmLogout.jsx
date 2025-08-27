import { Link } from "react-router";

function ConfirmLogout({ type, onClose }) {

  // Decide logout route based on type
  const getLogoutRoute = () => {
    switch (type) {
      case "donor":
        return "/donor-logout";
      case "ngo":
        return "/ngo-logout";
      case "admin":
        return "/admin-logout";
      default:
        return "/";
    }
  };

  return (
    <div className="w-full flex flex-col justify-center z-50 items-center">
      <i className="ri-logout-box-r-line text-[#F4C752] text-3xl"></i>
      <h2 className="font-bold text-2xl mt-2">Log Out</h2>
      <p className="mt-2 text-zinc-300">Are you sure you want to log out?</p>
      <div className="flex mt-5 gap-3">
        <button
          onClick={onClose}
          className="bg-gray-600 hover:bg-gray-700 text-white rounded-md px-6 py-2 transition-colors"
        >
          Cancel
        </button>
        <Link
          to={getLogoutRoute()}
          className="bg-[#ddb44c] hover:bg-[#c4a13a] text-white rounded-md px-6 py-2 transition-colors"
        >
          Sign Out
        </Link>
      </div>
    </div>
  );
}

export default ConfirmLogout;
