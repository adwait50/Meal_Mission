import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";

function DonorLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_BASE_URL}/api/donors/logout`);

        localStorage.removeItem("token");

        console.log("User logged out successfully.");

        // Navigate to the login page
        navigate("/donor-login");
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

export default DonorLogout;
