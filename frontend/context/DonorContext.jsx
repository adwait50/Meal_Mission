import axios from "axios";
import { createContext, useCallback, useContext, useState } from "react";

const DonorContext = createContext();

export const useDonor = () => {
  const context = useContext(DonorContext);
  if (!context) {
    throw new Error("useDonor must be used within a DonorProvider");
  }
  return context;
};

export const DonorProvider = ({ children }) => {
  const [donorData, setDonorData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDonorData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/donors/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDonorData(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching donor data", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    donorData,
    loading,
    error,
    fetchDonorData,
  };
  return (
    <DonorContext.Provider value={value}>{children}</DonorContext.Provider>
  );
};
