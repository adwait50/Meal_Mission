import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";

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

  // Function to fetch donor data
  const fetchDonorData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage");
      setError("No authentication token available. Please log in.");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching donor data...");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/donors/dashboard`, // Ensure this is the correct API
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);

      setDonorData(response.data);
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
  }, []); // Dependency array left empty since localStorage updates won't trigger re-fetch

  useEffect(() => {
    fetchDonorData();
  }, [fetchDonorData]);

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
