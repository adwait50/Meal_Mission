import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";

const NgoContext = createContext();

export const useNgo = () => {
  const context = useContext(NgoContext);
  if (!context) {
    throw new Error("useNgo must be used within a NgoProvider");
  }
  return context;
};

export const NgoProvider = ({ children }) => {
  const [ngoData, setNgoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNgoData = useCallback(async () => {
    setLoading(true);

    const token = localStorage.getItem("Ngotoken");
    if (!token) {
      console.error("No token found in localStorage");
      setError("No authentication token available. Please log in.");
      setLoading(false);
      return;
    }
    try {
      console.log("Fetching donor data...");
      console.log(token);
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/ngo/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNgoData(response.data);
      setError(null);
    } catch (error) {
      console.error(
        "Error fetching donor data:",
        error.response?.data || error.message
      );
      setError(error.response?.data?.message || "Failed to fetch donor data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNgoData();
  }, [fetchNgoData]);

  const value = {
    ngoData,
    loading,
    error,
    fetchNgoData,
  };
  return <NgoContext.Provider value={value}>{children}</NgoContext.Provider>;
};
