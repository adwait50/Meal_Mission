import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";

function AdminLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        localStorage.removeItem("Admintoken");

        console.log("Admin logged out successfully.");

        // Navigate to the login page
        navigate("/admin-login");
      } catch (error) {
        console.error("Error logging out:", error);
      }
    };

    logoutUser();
  }, [navigate]);

  return (
    <div className="h-screen w-full bg-zinc-700 text-white flex justify-center items-center text-2xl">
      You are logged out
    </div>
  );
}

export default AdminLogout;
