import React, { useEffect } from "react";
import { useNavigate } from "react-router";

function DonorProtectedWrapper({ children }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/donor-login");
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }
  return <div>{children}</div>;
}

export default DonorProtectedWrapper;
