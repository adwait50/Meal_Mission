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
    getSupportRequests()
  }, []);

  useEffect(() => {
    if (supports.length > 0) {
      if (statusFilter === "all") {
        setFilteredSupports(supports);
      } else if (statusFilter === "pending") {
        setFilteredSupports(supports.filter(support => !support.isCompleted));
      } else if (statusFilter === "resolved") {
        setFilteredSupports(supports.filter(support => support.isCompleted));
      }
    }
  }, [supports, statusFilter]);

  const getSupportRequests = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/donors/support-requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSupports(response.data);
        console.log("Support requests fetched:", response.data);
      }
      
    } catch (error) {
      console.log("Error fetching support requests:", error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
        return 'text-green-500 bg-green-100';
      case 'In Progress':
        return 'text-yellow-500 bg-yellow-100';
      case 'Pending':
        return 'text-blue-500 bg-blue-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-[#141C25] flex p-5 text-white">
      <SideBar />
      <div className="w-full flex-1 ml-[300px] px-6 py-8">
        {/* Header */}
        <button
            onClick={() => navigate(-1)}
            className="mb-4 text-gray-400 hover:text-white flex items-center gap-2 cursor-pointer "
          >
            ← Back 
          </button>
        <div className="mb-8 flex justify-between py-2 px-5 ">
          <div>

          <h1 className="text-3xl font-bold text-white">Previous Support Requests</h1>
          <p className="text-gray-400 mt-2">View all your previous support tickets</p>
          </div>
          
          {/* Filter Dropdown */}
          <div className="mt-4">
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-300 mb-2">
              Filter by Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#364153] border border-gray-600 text-white text-sm rounded-lg focus:ring-[#F4C752] focus:border-[#F4C752] block px-3 py-2 w-48"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Support Requests List */}
        <div className="bg-[#1E2939] rounded-xl p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F4C752] mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading support requests...</p>
            </div>
          ) : filteredSupports.length === 0 ? (
            <div className="text-center py-8">
              <i className="ri-message-3-line text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-400">
                {supports.length === 0 ? "No previous support requests found" : "No requests match the selected filter"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSupports.map((support) => (
                <div key={support._id} className="bg-[#364153] rounded-lg p-4 hover:bg-[#2a3444] transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{support.issue}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(support.isCompleted ? 'Resolved' : 'Pending')}`}>
                      {support.isCompleted ? 'Resolved' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-3">{support.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Created: {new Date(support.createdAt).toLocaleDateString()}</span>
                    {support.isCompleted && (
                      <span>Status: {support.isCompleted ? 'Completed' : 'Pending'}</span>
                    )}
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