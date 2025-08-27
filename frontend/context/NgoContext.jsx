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
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // fetch NGO Dashboard Data
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
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/ngo/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNgoData(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching ngo data:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to fetch NGO data");
    } finally {
      setLoading(false);
    }
  }, []);

  // fetch NGO Stats
  const fetchNgoStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("Ngotoken");
      if (!token) {
        console.error("No token found for stats");
        return;
      }
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/ngo/donation-history`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch NGO stats", err);
    }
  }, []);

  useEffect(() => {
    fetchNgoData();
    fetchNgoStats();
  }, [fetchNgoData, fetchNgoStats]);

  const value = {
    ngoData,
    stats,
    loading,
    error,
    fetchNgoData,
    fetchNgoStats,
  };
  return <NgoContext.Provider value={value}>{children}</NgoContext.Provider>;
};
