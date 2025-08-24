import { useEffect, useState } from "react";
import NgoSideBar from "../../components/NgoSidebar";
import { useNavigate } from "react-router";

function DonorPreviousSupports() {
  const [supports, setSupports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching previous support requests
    // Replace this with actual API call
    setTimeout(() => {
      setSupports([
        {
          id: 1,
          subject: "Donation Pickup Issue",
          message: "Having trouble scheduling pickup for food donation",
          status: "Resolved",
          createdAt: "2024-01-15",
          resolvedAt: "2024-01-16"
        },
        {
          id: 2,
          subject: "Account Verification",
          message: "Need help with account verification process",
          status: "In Progress",
          createdAt: "2024-01-10",
          resolvedAt: null
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

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
      <NgoSideBar />
      <div className="w-full flex-1 ml-[300px] px-6 py-8">
        {/* Header */}
        <button
            onClick={() => navigate(-1)}
            className="mb-4 text-gray-400 hover:text-white flex items-center gap-2 cursor-pointer "
          >
            ← Back 
          </button>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Previous Support Requests</h1>
          <p className="text-gray-400 mt-2">View all your previous support tickets</p>
        </div>

        {/* Support Requests List */}
        <div className="bg-[#1E2939] rounded-xl p-6">NGO history tickets
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F4C752] mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading support requests...</p>
            </div>
          ) : supports.length === 0 ? (
            <div className="text-center py-8">
              <i className="ri-message-3-line text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-400">No previous support requests found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {supports.map((support) => (
                <div key={support.id} className="bg-[#364153] rounded-lg p-4 hover:bg-[#2a3444] transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{support.subject}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(support.status)}`}>
                      {support.status}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-3">{support.message}</p>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Created: {support.createdAt}</span>
                    {support.resolvedAt && (
                      <span>Resolved: {support.resolvedAt}</span>
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