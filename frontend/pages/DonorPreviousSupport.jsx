import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { useNavigate } from "react-router";
import axios from "axios";

function DonorPreviousSupports() {
  const [supports, setSupports] = useState([]);
  const [filteredSupports, setFilteredSupports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    getSupportRequests();
  }, []);

  useEffect(() => {
    if (supports.length > 0) {
      if (statusFilter === "all") setFilteredSupports(supports);
      else if (statusFilter === "pending")
        setFilteredSupports(supports.filter((s) => !s.isCompleted));
      else if (statusFilter === "resolved")
        setFilteredSupports(supports.filter((s) => s.isCompleted));
    }
  }, [supports, statusFilter]);

  const getSupportRequests = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/donors/support-requests`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) setSupports(response.data);
    } catch (error) {
      console.log("Error fetching support requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "text-green-500 bg-green-100";
      case "In Progress":
        return "text-yellow-500 bg-yellow-100";
      case "Pending":
        return "text-blue-500 bg-blue-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  const totalRequests = supports.length;
  const resolvedRequests = supports.filter((s) => s.isCompleted).length;
  const pendingRequests = supports.filter((s) => !s.isCompleted).length;

  return (
    <div className="min-h-screen bg-[#141C25] flex flex-col sm:flex-row p-4 sm:p-5 text-white">
      {/* Sidebar hidden on mobile */}
      <div className="hidden sm:block flex-shrink-0">
        <SideBar />
      </div>

      {/* Main content */}
      <div className="w-full sm:flex-1 sm:ml-[300px] px-0 sm:px-6 py-4 sm:py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-gray-400 hover:text-white flex items-center gap-2 cursor-pointer"
        >
          ← Back
        </button>

        {/* Header & Filter */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 items-start sm:items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Previous Support Requests
            </h1>
            <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
              View all your previous support tickets
            </p>
          </div>

          <div className="w-full sm:w-auto mt-2 sm:mt-0">
            <label
              htmlFor="statusFilter"
              className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2"
            >
              Filter by Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#364153] border border-gray-600 text-white text-sm rounded-lg focus:ring-[#F4C752] focus:border-[#F4C752] block w-full sm:w-48 px-3 py-2"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className=" flex  justify-between gap-3  md:grid md:grid-cols-3 md:gap-6 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-medium text-gray-300">Total Requests</h3>
            <p className="text-2xl font-bold text-yellow-400">{totalRequests}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-medium text-gray-300">Resolved Requests</h3>
            <p className="text-2xl font-bold text-green-400">{resolvedRequests}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-medium text-gray-300">Pending Requests</h3>
            <p className="text-2xl font-bold text-blue-400">{pendingRequests}</p>
          </div>
        </div>

        
        <div className="bg-[#1E2939] rounded-xl p-4 sm:p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F4C752] mx-auto"></div>
              <p className="text-gray-400 mt-3">Loading support requests...</p>
            </div>
          ) : filteredSupports.length === 0 ? (
            <div className="text-center py-8">
              <i className="ri-message-3-line text-4xl text-gray-400 mb-3"></i>
              <p className="text-gray-400">
                {supports.length === 0
                  ? "No previous support requests found"
                  : "No requests match the selected filter"}
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredSupports.map((support) => (
                <div
                  key={support._id}
                  className="bg-[#364153] rounded-lg p-3 sm:p-4 hover:bg-[#2a3444] transition-colors flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                >
                  <div>
                    <h3 className="font-semibold text-sm sm:text-lg">{support.issue}</h3>
                    <p className="text-gray-300 text-xs sm:text-sm mt-1">{support.description}</p>
                  </div>
                  <div className="flex flex-col  sm:items-center gap-2 mt-2 sm:mt-0">
                    <span
                      className={`px-2 py-1 items-center flex justify-center rounded-full text-xs sm:text-sm font-medium  ${getStatusColor(
                        support.isCompleted ? "Resolved" : "Pending"
                      )}`}
                    >
                      {support.isCompleted ? "Resolved" : "Pending"}
                    </span>
                    <span className="text-gray-400 text-xs sm:text-sm">
                      Created: {new Date(support.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DonorPreviousSupports;
