import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function DonationDetail() {
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
      const token = localStorage.getItem("Ngotoken");
      
      // Get the specific donation details using the new route
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/ngo/donation/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);


      if (response.status === 200) {
        setDonation(response.data);
      }
    } catch (error) {
      console.error("Error fetching donation details:", error);
      if (error.response?.status === 404) {
        setError("Donation not found");
      } else if (error.response?.status === 403) {
        setError("Access denied. This donation is not in your area.");
      } else {
        setError("Failed to fetch donation details");
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
            onClick={() => navigate('/ngo-dashboard/browse-pickup')}
            className="bg-[#F4C752] px-4 py-2 font-semibold rounded-lg text-black hover:bg-[#e6b94a] transition-colors"
          >
            Back to Pickup Requests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-9">
  {/* Header */}
  <div className="mb-6 sm:mb-8">
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-[#F4C752] hover:text-[#e6b94a] transition-colors mb-4 text-sm sm:text-base"
    >
      <span>←</span> Back
    </button>
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl text-zinc-200 font-semibold mb-1">
          Donation Details
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base">
          Request ID: {donation.requestId || donation._id}
        </p>
      </div>
      <div className="text-left sm:text-right">
        {getStatusBadge(donation.status)}
        <p className="text-zinc-400 text-xs sm:text-sm mt-1">
          Last updated: {formatDate(donation.createdAt)}
        </p>
      </div>
    </div>
  </div>

  {/* Main Content */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
    {/* Left Column */}
    <div className="space-y-4">
      {/* Food Information */}
      <div className="bg-[#1E2939] p-4 sm:p-6 rounded-lg border border-gray-600">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 flex items-center gap-2">
          🍽️ Food Information
        </h2>
        <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
          <div className="flex justify-between">
            <span className="text-zinc-300">Food Items:</span>
            <span className="text-white font-medium">{donation.foodItems}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-300">Quantity:</span>
            <span className="text-white font-medium">{donation.quantity} units</span>
          </div>
          {donation.additionalNotes && (
            <div className="pt-2 sm:pt-3 border-t border-gray-600">
              <span className="text-zinc-300">Additional Notes:</span>
              <p className="text-white mt-1">{donation.additionalNotes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Pickup Information */}
      <div className="bg-[#1E2939] p-4 sm:p-6 rounded-lg border border-gray-600">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 flex items-center gap-2">
          📍 Pickup Information
        </h2>
        <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
          <div className="flex justify-between"><span className="text-zinc-300">Address:</span><span className="text-white font-medium text-right max-w-[60%]">{donation.address}</span></div>
          <div className="flex justify-between"><span className="text-zinc-300">City:</span><span className="text-white font-medium">{donation.city}</span></div>
          <div className="flex justify-between"><span className="text-zinc-300">State:</span><span className="text-white font-medium">{donation.state}</span></div>
          <div className="flex justify-between"><span className="text-zinc-300">Pickup Date:</span><span className="text-white font-medium">{formatDate(donation.pickupDate)}</span></div>
        </div>
      </div>

      {/* Donor Information */}
      {donation.donor && (
        <div className="bg-[#1E2939] p-4 sm:p-6 rounded-lg border border-gray-600">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 flex items-center gap-2">
            👤 Donor Information
          </h2>
          <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
            <div className="flex justify-between"><span className="text-zinc-300">Name:</span><span className="text-white font-medium">{donation.donor.name}</span></div>
            <div className="flex justify-between"><span className="text-zinc-300">Email:</span><span className="text-white font-medium">{donation.donor.email}</span></div>
            {donation.phone && (
              <div className="flex justify-between"><span className="text-zinc-300">Phone:</span><span className="text-white font-medium">{donation.phone}</span></div>
            )}
          </div>
        </div>
      )}
    </div>

    {/* Right Column */}
    <div className="space-y-4">
      {/* Image Proof */}

      {donation.foodImage && (
           <div className="bg-gray-800 p-3 sm:p-5 rounded-lg border border-gray-600 space-y-3 sm:space-y-4">
             <h2 className="text-lg sm:text-xl font-semibold mb-2">
               <i className="ri-file-image-line"></i> Image Provided
             </h2>
             <div className="text-center p-2 bg-gray-700 rounded-lg">
               <img 
                 className="w-full h-auto max-h-[300px] sm:max-h-[400px] object-contain rounded-lg cursor-pointer hover:opacity-90 transition-opacity" 
                 src={donation.foodImage} 
                 alt="Food image" 
                 onClick={() => window.open(donation.foodImage, '_blank')}
                 title="Click to open image in new tab"
               />
             </div>
             <p className="text-xs sm:text-sm text-zinc-400 text-center">
               Tap image to view full size
             </p>
           </div>
           )}
      {/* Status Management */}
      <div className="bg-[#1E2939] p-4 sm:p-6 rounded-lg border border-gray-600">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 flex items-center gap-2">
          ⚙️ Status Management
        </h2>
        <div className="space-y-3">
          <div className="text-center p-3 sm:p-4 bg-[#2d3748] rounded-lg text-sm sm:text-base">
            <p className="text-zinc-300 mb-1 sm:mb-2">Current Status</p>
            <div className="text-lg sm:text-2xl font-bold text-[#F4C752]">{donation.status}</div>
          </div>

          {/* Action Buttons */}
          {donation.status === 'Pending' && (
            <button
              onClick={() => updateDonationStatus('Accepted')}
              disabled={updating}
              className="w-full bg-[#F4C752] text-black font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-[#e6b94a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {updating ? 'Accepting...' : '✅ Accept Request'}
            </button>
          )}

          {donation.status === 'In Progress' && (
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={() => updateDonationStatus('Completed')}
                disabled={updating}
                className="w-full bg-green-500 text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {updating ? 'Updating...' : '✅ Mark as Completed'}
              </button>
              <button
                onClick={() => updateDonationStatus('Rejected')}
                disabled={updating}
                className="w-full bg-red-500 text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {updating ? 'Rejecting...' : '❌ Reject Request'}
              </button>
            </div>
          )}

          {donation.status === 'Completed' && (
            <div className="text-center p-3 sm:p-4 bg-green-900/20 border border-green-500/30 rounded-lg text-sm sm:text-base">
              <p className="text-green-400 text-base sm:text-lg font-semibold">🎉 Donation Completed!</p>
              <p className="text-zinc-400 text-xs sm:text-sm mt-1">This donation has been successfully picked up</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#1E2939] p-4 sm:p-6 rounded-lg border border-gray-600 space-y-2 sm:space-y-3">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3 flex items-center gap-2">🚀 Quick Actions</h2>
        <button className="w-full bg-[#2d3748] text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-[#4a5568] transition-colors border border-gray-600 text-sm sm:text-base">📞 Contact Donor</button>
        <button className="w-full bg-[#2d3748] text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-[#4a5568] transition-colors border border-gray-600 text-sm sm:text-base">🗺️ Get Directions</button>
        <button onClick={() => window.print()} className="w-full bg-[#2d3748] text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-[#4a5568] transition-colors border border-gray-600 text-sm sm:text-base">🖨️ Print Details</button>
      </div>
    </div>
  </div>
</div>

  );
}

export default DonationDetail;
