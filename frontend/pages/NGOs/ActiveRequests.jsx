import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ActiveRequests() {
  const navigate = useNavigate();
  const [activeRequests, setActiveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActiveRequests();
  }, []);

  const fetchActiveRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("Ngotoken");
      
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/ngo/accepted-donations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response)
      if (response.status === 200) {
        setActiveRequests(response.data);
      }
    } catch (error) {
      console.error("Error fetching active requests:", error);
      setError("Failed to fetch active requests");
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = async (requestId) => {
    try {
      const token = localStorage.getItem("Ngotoken");
      
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/ngo/donation/${requestId}/completed`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Remove the completed request from the list
        setActiveRequests(prev => prev.filter(request => request._id !== requestId));
      }
    } catch (error) {
      console.error("Error marking request as completed:", error);
      alert("Failed to mark request as completed. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    return (
      <span className="px-3 py-1 rounded-full text-white text-sm font-medium bg-orange-500">
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex-1 p-9">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F4C752]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-9">
        <div className="text-center min-h-[400px] flex flex-col items-center justify-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={fetchActiveRequests}
            className="bg-[#F4C752] px-4 py-2 font-semibold rounded-lg text-black hover:bg-[#e6b94a] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-9">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/ngo-dashboard')}
          className="flex items-center gap-2 text-[#F4C752] hover:text-[#e6b94a] transition-colors mb-4"
        >
          <span>←</span> Back to Dashboard
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-zinc-200 font-semibold mb-2">
              Active Requests
            </h1>
            <p className="text-zinc-400">
              Manage your accepted donation requests that are currently in progress
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#F4C752]">
              {activeRequests.length}
            </div>
            <p className="text-zinc-400 text-sm">Active Requests</p>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeRequests.length === 0 ? (
        <div className="text-center min-h-[400px] flex flex-col items-center justify-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl text-zinc-200 font-semibold mb-2">No Active Requests</h2>
          <p className="text-zinc-400 mb-6">
            You don't have any active donation requests at the moment.
          </p>
          <button
            onClick={() => navigate('/ngo-dashboard/browse-pickup')}
            className="bg-[#F4C752] px-6 py-3 font-semibold rounded-lg text-black hover:bg-[#e6b94a] transition-colors"
          >
            Browse Available Donations
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {activeRequests.map((request) => (
            <div
              key={request._id}
              className="bg-[#364153] p-6 rounded-lg border border-gray-600 hover:border-[#F4C752]/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold text-white">
                      {request.foodItems}
                    </h3>
                    {getStatusBadge(request.status)}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-zinc-400">Quantity: </span>
                      <span className="text-white font-medium">{request.quantity} units</span>
                    </div>
                    <div>
                      <span className="text-zinc-400">Pickup Date: </span>
                      <span className="text-white font-medium">
                        {formatDate(request.pickupDate)}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-400">Address: </span>
                      <span className="text-white font-medium">{request.address}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400">City: </span>
                      <span className="text-white font-medium">{request.city}</span>
                    </div>
                  </div>
                  
                  {request.additionalNotes && (
                    <div className="mt-3 pt-3 border-t border-gray-600">
                      <span className="text-zinc-400">Notes: </span>
                      <span className="text-white">{request.additionalNotes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Donor Information */}
              {request.donor && (
                <div className="bg-[#2d3748] p-4 rounded-lg mb-4">
                  <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                    👤 Donor Information
                  </h4>
                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-zinc-400">Name: </span>
                      <span className="text-white">{request.donorName}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400">Email: </span>
                      <span className="text-white">{request.donor.email}</span>
                    </div>
                    {request.donor.phone && (
                      <div>
                        <span className="text-zinc-400">Phone: </span>
                        <span className="text-white">{request.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate(`/ngo-dashboard/donation/${request._id}`)}
                  className="bg-[#F4C752] text-black font-semibold py-2 px-4 rounded-lg hover:bg-[#e6b94a] transition-colors"
                >
                  📋 View Details
                </button>
                <button
                  onClick={() => markAsCompleted(request._id)}
                  className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                >
                  ✅ Mark as Completed
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement contact donor functionality
                    alert("Contact donor functionality coming soon!");
                  }}
                  className="bg-[#2d3748] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#4a5568] transition-colors border border-gray-600"
                >
                  📞 Contact Donor
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActiveRequests;
