import axios from "axios";
import { useEffect, useState } from "react";

function AdminDashboardContent() {
  const [ngos, setNgos] = useState([]);
  const [filteredNgos, setFilteredNgos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNgos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("Admintoken");
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNgos(response.data);
      setFilteredNgos(response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch NGOs");
    } finally {
      setLoading(false);
    }
  };

  const deleteNgo = async (id, ngoName) => {
    try {
      // Show confirmation dialog
      const isConfirmed = window.confirm(`Are you sure you want to delete ${ngoName}? This action cannot be undone.`);
      if (!isConfirmed) return;

      const token = localStorage.getItem("Admintoken");
      const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/admin/ngo/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.status === 200) {
        alert(`${ngoName} has been deleted successfully!`);
        // Refresh the page to show updated NGO list
        fetchNgos();
      }
    } catch (error) {
      console.error(error);
      alert(`Error deleting NGO: ${error.response?.data?.message || 'Something went wrong. Please try again.'}`);
    }
  };

  // Search functionality
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    
    if (!searchValue.trim()) {
      setFilteredNgos(ngos);
      return;
    }

    const filtered = ngos.filter((ngo) => {
      const searchLower = searchValue.toLowerCase();
      return (
        ngo.name?.toLowerCase().includes(searchLower) ||
        ngo.city?.toLowerCase().includes(searchLower) ||
        ngo.state?.toLowerCase().includes(searchLower) ||
        ngo.email?.toLowerCase().includes(searchLower) ||
        ngo.phone?.toLowerCase().includes(searchLower)
      );
    });
    
    setFilteredNgos(filtered);
  };

  useEffect(() => {
    fetchNgos();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141C25] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#141C25] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={fetchNgos}
            className="bg-yellow-500 px-4 py-2 rounded-lg font-semibold text-black hover:bg-yellow-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141C25] text-white p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
          Approved NGOs Dashboard
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base">
          Total Approved NGOs: {ngos.length}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-zinc-400">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Search by name, city, state, email, or phone..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearch("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="text-sm text-zinc-400 mt-2">
            Showing {filteredNgos.length} of {ngos.length} NGOs
          </p>
        )}
      </div>

      {/* NGO Grid */}
      {filteredNgos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏢</div>
          <h2 className="text-xl font-semibold text-zinc-300 mb-2">
            {searchTerm ? "No NGOs found" : "No Approved NGOs"}
          </h2>
          <p className="text-zinc-500">
            {searchTerm 
              ? `No NGOs match your search for "${searchTerm}"`
              : "There are currently no approved NGOs in the system."
            }
          </p>
          {searchTerm && (
            <button
              onClick={() => handleSearch("")}
              className="mt-4 bg-yellow-500 px-4 py-2 rounded-lg font-semibold text-black hover:bg-yellow-600 transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredNgos.map((ngo) => (
            <div
              key={ngo._id}
              className="bg-gray-800/80 rounded-xl shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-xl"
            >
              {/* NGO Header */}
              <div className="p-4 sm:p-6 border-b border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg sm:text-xl font-bold text-white truncate flex-1 mr-2">
                    {ngo.name}
                  </h3>
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    ✅ Approved
                  </span>
                </div>
                
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-zinc-300">
                    <span className="text-yellow-400 mr-2">📧</span>
                    <span className="truncate">{ngo.email}</span>
                  </div>
                  {ngo.phone && (
                    <div className="flex items-center text-sm text-zinc-300">
                      <span className="text-yellow-400 mr-2">📞</span>
                      <span>{ngo.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Location Info */}
              <div className="p-4 sm:p-6 border-b border-gray-700">
                <h4 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wide">
                  📍 Location
                </h4>
                <div className="space-y-1 text-sm text-zinc-300">
                  <p className="truncate">{ngo.address}</p>
                  <p>{ngo.city}, {ngo.state}</p>
                </div>
              </div>

              {/* Status & Details */}
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-zinc-400">Verified:</span>
                    <span className={`ml-2 font-medium ${ngo.isVerified ? 'text-green-400' : 'text-red-400'}`}>
                      {ngo.isVerified ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Registration:</span>
                    <span className="ml-2 font-medium text-zinc-300">
                      {formatDate(ngo.registrationDate)}
                    </span>
                  </div>
                </div>

                {/* Document Proof */}
                {ngo.documentProof && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-zinc-400 mb-2 uppercase tracking-wide">
                      📄 Document Proof
                    </h4>
                    <img
                      src={ngo.documentProof}
                      alt="NGO Document"
                      className="w-full h-32 object-cover rounded-lg border border-gray-600 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(ngo.documentProof, '_blank')}
                      title="Click to view full size"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => deleteNgo(ngo._id, ngo.name)}
                    className="w-full bg-red-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 group"
                  >
                    <span className="text-red-200 group-hover:text-white transition-colors">🗑️</span>
                    Delete NGO
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboardContent;
