import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";

function RequestDetail() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showPopup, setShowPopup] = useState(false);

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

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/donors/donation/${requestId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(response)

      if (response.status === 200 && response.data) {
        setDonation(response.data);
      } else {
        setError("Invalid response from server");
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 404) setError("Donation not found");
      else if (error.response?.status === 403)
        setError("Access denied. This donation is not in your area.");
      else setError("Failed to fetch donation details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString, withTime = true) => {
    if (!dateString) return "Not specified";
    const options = withTime
      ? { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
      : { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  
  

  const cancelRequest = () => setShowPopup(true);

  const cancelPending = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      // Show confirmation dialog
      const isConfirmed = window.confirm("Are you sure you want to cancel this donation request? This action cannot be undone.");
      if (!isConfirmed) return;
  
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/donors/donation/${requestId}/cancel`,
        {}, // empty body
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status === 200) {
        alert("Request cancelled successfully");
        setDonation((prev) => ({ ...prev, status: "Cancelled" }));
        // Refresh the donation details to show updated status
        fetchDonationDetails();
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 404) {
        alert("Donation not found or you don't have access to it.");
      } else if (error.response?.status === 400) {
        alert(error.response.data?.message || "Cannot cancel this donation.");
      } else if (error.response?.status === 403) {
        alert("You don't have permission to cancel this donation.");
      } else {
        alert("Failed to cancel donation. Please try again.");
      }
    }
  };
  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#141C25] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error || !donation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#141C25] text-white px-4">
        <p className="text-red-500 text-lg mb-4">{error || "Donation not found"}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-yellow-500 px-4 py-2 rounded-lg font-semibold text-black hover:bg-yellow-600 transition-colors"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141C25] text-white px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-yellow-400 hover:text-yellow-500 mb-6"
      >
        ← Back
      </button>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold">{`Donation Details`}</h1>
        <p className="text-zinc-400 text-sm mt-1">Request ID: {donation.requestId || donation._id}</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-24 ">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Food Info */}
          <div className="bg-gray-800 p-5 rounded-lg border border-gray-600">
            <h2 className="text-xl font-semibold mb-3">🍽️ Food Information</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-300">Food Items:</span>
                <span className="font-medium">{donation.foodItems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-300">Quantity:</span>
                <span className="font-medium">{donation.quantity} units</span>
              </div>
              {donation.additionalNotes && (
                <div className="border-t border-gray-600 pt-2">
                  <span className="text-zinc-300">Notes:</span>
                  <p className="font-medium mt-1">{donation.additionalNotes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Pickup Info */}
          <div className="bg-gray-800 p-5 rounded-lg border border-gray-600">
            <h2 className="text-xl font-semibold mb-3">📍 Pickup Information</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-300">Address:</span>
                <span className="font-medium max-w-[60%] text-right">{donation.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-300">City:</span>
                <span className="font-medium">{donation.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-300">State:</span>
                <span className="font-medium">{donation.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-300">Pickup Date:</span>
                <span className="font-medium">{formatDate(donation.pickupDate)}</span>
              </div>
            </div>
          </div>

          {/* Donor Info */}
          {donation.donor && (
            <div className="bg-gray-800 p-5 rounded-lg border border-gray-600">
              <h2 className="text-xl font-semibold mb-3">👤 Donor Information</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-300">Name:</span>
                  <span className="font-medium">{donation.donorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-300">Email:</span>
                  <span className="font-medium">{donation.donor.email}</span>
                </div>
                {donation.phone && (
                  <div className="flex justify-between">
                    <span className="text-zinc-300">Phone:</span>
                    <span className="font-medium">{donation.phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
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


          {/* Status & Actions */}
          <div className="bg-gray-800 p-5 rounded-lg border border-gray-600 space-y-4">
            <h2 className="text-xl font-semibold mb-2">⚙️ Status</h2>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <p className="text-zinc-300">Current Status</p>
              <div className="text-2xl font-bold text-yellow-400 mt-1">{donation.status}</div>
            </div>

            {donation.status === "Pending" && (
                <div>

              <div className="text-center p-4 bg-gray-700 rounded-lg text-zinc-300">
                Please wait for any NGO to accept the request.
              </div>
                <button
                  onClick={()=>cancelPending(donation._id)}
                  className="w-full p-4 mt-3 rounded-lg bg-gray-700 text-zinc-300 hover:bg-gray-600 hover:text-red-500 transition transform hover:scale-105"
                >
                  Cancel Request
                </button>
                </div>
              
            )}

            {["In Progress", "Accepted"].includes(donation.status) && (
              <>
                <div className="bg-gray-700 p-4 rounded-lg text-center text-zinc-300">
                  The NGO has accepted your request. Check your email for details.
                </div>
                <div className="bg-gray-800 p-5 rounded-lg border border-gray-600">
                  <h3 className="text-lg font-semibold mb-2">🏢 NGO Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-zinc-300">Name:</span>
                      <span className="font-medium">{donation.ngo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-300">Email:</span>
                      <span className="font-medium">{donation.ngo.email}</span>
                    </div>
                    {donation.ngo.phone && (
                      <div className="flex justify-between">
                        <span className="text-zinc-300">Phone:</span>
                        <span className="font-medium">{donation.ngo.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={cancelRequest}
                  className="w-full p-4 mt-3 rounded-lg bg-gray-700 text-zinc-300 hover:bg-gray-600 hover:text-red-500 transition transform hover:scale-105"
                >
                  Cancel Request
                </button>
              </>
            )}

            {donation.status === "Completed" && (
              <div className="text-center p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                <p className="text-green-400 font-semibold">🎉 Donation Completed!</p>
                <p className="text-zinc-400 text-sm mt-1">
                  This donation has been successfully picked up.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 px-4">
          <div className="bg-gray-800 p-5 rounded-lg w-full max-w-md border border-gray-600 relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-3">Cancel Request</h2>
            <p className="text-zinc-300">Please contact the NGO directly if you want to cancel this request.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestDetail;
