import React, { useEffect } from "react";
import { useNavigate } from "react-router";

function NgoProtectedWrapper({ children }) {
  const token = localStorage.getItem("token");
  // console.log(token);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/ngo-login");
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }
  return <div>{children}</div>;
}

export default NgoProtectedWrapper;
