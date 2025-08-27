import React, { useEffect } from "react";
import { useNavigate } from "react-router";

function AdminProtectedWrapper({ children }) {
  const token = localStorage.getItem("Admintoken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }
  return <div>{children}</div>;
}
export default AdminProtectedWrapper;
