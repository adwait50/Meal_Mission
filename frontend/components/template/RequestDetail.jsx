import React from "react";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";
function RequestDetail() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  console.log(requestId);
  useEffect(() => {
    fetchDonationDetails();
  }, [requestId]);

  const fetchDonationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      // console.log("Fetching donation with ID:", requestId);
      
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/donors/donation/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // console.log("Donation details response:", response.data);

      if (response.status === 200 && response.data) {
        setDonation(response.data);
      } else {
        setError("Invalid response from server");
      }
    } catch (error) {
      console.error("Error fetching donation details:", error);
      if (error.response?.status === 404) {
        setError("Donation not found");
      } else if (error.response?.status === 403) {
        setError("Access denied. This donation is not in your area.");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to fetch donation details. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateDonationStatus = async (newStatus) => {
    try {
      setUpdating(true);
      const token = localStorage.getItem("Ngotoken");
      console.log(token);
      
      let endpoint;
      if (newStatus === 'Accepted') {
        endpoint = `${import.meta.env.VITE_BASE_URL}/api/ngo/donation/${requestId}/accept`;
      } else if (newStatus === 'Rejected') {
        endpoint = `${import.meta.env.VITE_BASE_URL}/api/ngo/donation/${requestId}/reject`;
      } else if (newStatus === 'In Progress') {
        endpoint = `${import.meta.env.VITE_BASE_URL}/api/ngo/donation/${requestId}/in-progress`;
      } else if (newStatus === 'Completed') {
        endpoint = `${import.meta.env.VITE_BASE_URL}/api/ngo/donation/${requestId}/completed`;
      } else {
        // Fallback for any other status updates
        endpoint = `${import.meta.env.VITE_BASE_URL}/api/ngo/donation/${requestId}/status`;
      }
      
      const response = await axios.put(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);

      if (response.status === 200) {
        // Update local state
        setDonation(prev => ({ ...prev, status: newStatus }));
        alert(`Donation status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error("Error updating donation status:", error);
      alert("Failed to update donation status. Please try again.");
    } finally {
      setUpdating(false);
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
    const colors = {
      'Pending': 'bg-yellow-500',
      'Accepted': 'bg-blue-500',
      'In Progress': 'bg-orange-500',
      'Completed': 'bg-green-500'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${colors[status] || 'bg-gray-500'}`}>
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

  if (error || !donation) {
    return (
      <div className="flex-1 p-9">
        <div className="text-center min-h-[400px] flex flex-col items-center justify-center">
          <p className="text-red-500 text-lg mb-4">{error || "Donation not found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#F4C752] px-4 py-2 font-semibold rounded-lg text-black hover:bg-[#e6b94a] transition-colors"
          >
            Back 
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
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#F4C752] hover:text-[#e6b94a] transition-colors mb-4"
        >
          <span>←</span> Back 
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-zinc-200 font-semibold mb-2">
              Donation Details
            </h1>
            <p className="text-zinc-400">Request ID: {donation.requestId || donation._id}</p>
          </div>
          <div className="text-right">
            {getStatusBadge(donation.status)}
            <p className="text-zinc-400 text-sm mt-1">
              Last updated: {formatDate(donation.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Donation Details */}
        <div className="space-y-6">
          {/* Food Information */}
          <div className="bg-[#364153] p-6 rounded-lg border border-gray-600">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              🍽️ Food Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-zinc-300">Food Items:</span>
                <span className="text-white font-medium">{donation.foodItems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-300">Quantity:</span>
                <span className="text-white font-medium">{donation.quantity} units</span>
              </div>
              {donation.additionalNotes && (
                <div className="pt-3 border-t border-gray-600">
                  <span className="text-zinc-300">Additional Notes:</span>
                  <p className="text-white mt-1">{donation.additionalNotes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Pickup Information */}
          <div className="bg-[#364153] p-6 rounded-lg border border-gray-600">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              📍 Pickup Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-zinc-300">Address:</span>
                <span className="text-white font-medium text-right max-w-[60%]">{donation.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-300">City:</span>
                <span className="text-white font-medium">{donation.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-300">State:</span>
                <span className="text-white font-medium">{donation.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-300">Pickup Date:</span>
                <span className="text-white font-medium">{formatDate(donation.pickupDate)}</span>
              </div>
            </div>
          </div>

          {/* Donor Information */}
          {donation.donor && (
            <div className="bg-[#364153] p-6 rounded-lg border border-gray-600">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                👤 Donor Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-zinc-300">Name:</span>
                  <span className="text-white font-medium">{donation.donor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-300">Email:</span>
                  <span className="text-white font-medium">{donation.donor.email}</span>
                </div>
                {donation.phone && (
                  <div className="flex justify-between">
                    <span className="text-zinc-300">Phone:</span>
                    <span className="text-white font-medium">{donation.phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Actions and Status */}
        <div className="space-y-6">
          {/* Status Management */}
          <div className="bg-[#364153] p-6 rounded-lg border border-gray-600">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              ⚙️ Status Management
              
            </h2>
            
            <div className="space-y-4">
              <div className="text-center p-4 bg-[#2d3748] rounded-lg">
                <p className="text-zinc-300 mb-2">Current Status</p>
                <div className="text-2xl font-bold text-[#F4C752]">{donation.status}</div>
                
              </div>

              {/* Action Buttons */}
              {donation.status === 'Pending' && (
                <div className="space-y-3">
                  <div className="bg-[#364153] w-full p-6 rounded-lg  flex justify-center items-center border text-center text-zinc-300 text-md mt-1  border-gray-600">
                    
                  Please wait for any NGO to accept the request.
                  </div>
                    
                </div>
              )}


              {donation.status === 'In Progress' && (
                <div className="space-y-3">
                  <div className="text-zinc-400 text-md mt-1 ">
                  

              </div>
              <div className="bg-[#364153] w-full p-6 rounded-lg  flex justify-center items-center border text-center text-zinc-300 text-md mt-1  border-gray-600">
                    
              The below NGO has accepted your request. Please check your email for the details.
                  </div>
                  
                  <div className="bg-[#364153] p-6 rounded-lg border mt-5 border-gray-600">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      🏢 NGO Information
                    </h2>
              <div className="space-y-3"> 
                <div className="flex justify-between">
                  <span className="text-zinc-300">Name:</span>
                  <span className="text-white font-medium">{donation.ngo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-300">Email:</span>
                  <span className="text-white font-medium">{donation.ngo.email}</span>
                </div>
                {donation.ngo.phone && (
                  <div className="flex justify-between">
                    <span className="text-zinc-300">Phone:</span>
                    <span className="text-white font-medium">{donation.ngo.phone}</span>
                  </div>
                )}
              </div>
            </div>
                  
                </div>
              )}

              {donation.status === 'Completed' && (
                <div>

                <div className="text-center p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 text-lg font-semibold">🎉 Donation Completed!</p>
                  <p className="text-zinc-400 text-sm mt-1">
                    This donation has been successfully picked up
                  </p>
                  
                </div>
                <div className="bg-[#364153] p-6 rounded-lg border mt-5 border-gray-600">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      🏢 NGO Information
                    </h2>
              <div className="space-y-3"> 
                <div className="flex justify-between">
                  <span className="text-zinc-300">Name:</span>
                  <span className="text-white font-medium">{donation.ngo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-300">Email:</span>
                  <span className="text-white font-medium">{donation.ngo.email}</span>
                </div>
                {donation.ngo.phone && (
                  <div className="flex justify-between">
                    <span className="text-zinc-300">Phone:</span>
                    <span className="text-white font-medium">{donation.ngo.phone}</span>
                  </div>
                )}
              </div>
            </div>
                  </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default RequestDetail;
