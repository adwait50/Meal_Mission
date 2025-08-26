import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function PendingNgosContent() {
  const [pendingNgos, setPendingNgos] = useState([]);

  const fetchPendingNgo = async () => {
    try {
      const token = localStorage.getItem("Admintoken");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/admin/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setPendingNgos(response.data);
      }
    } catch (error) {
      console.error("Error fetching pending NGOs:", error);
    }
  };

  useEffect(() => {
    fetchPendingNgo();
  }, []);

  return (
    <div className="flex-1  p-6 md:p-9 bg-[#141C25] min-h-screen text-white">
      <h1 className="text-2xl md:text-3xl text-zinc-200 font-semibold">
        Pending NGO Approvals
      </h1>

      {/* NGO List */}
      <div className="mt-8 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {pendingNgos.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 bg-gray-800/50 rounded-xl shadow-md">
            
            <h2 className="text-xl font-semibold">All NGOs are reviewed ✅</h2>
            <p className="text-gray-400 mt-2 text-center max-w-md">
              Great job! There are currently no NGOs awaiting approval.  
              Check back later for new requests.
            </p>
            <Link
              to="/admin-dashboard"
              className="mt-6 bg-[#F4C752] hover:bg-[#e6b94a] text-black font-semibold px-5 py-2 rounded-lg transition"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          pendingNgos.map((ngo) => (
            <div
              key={ngo._id}
              className="bg-gray-800 rounded-xl p-6 shadow-lg flex flex-col justify-between hover:shadow-2xl hover:bg-gray-700/70 transition"
            >
              {/* NGO Info */}
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-white">
                  {ngo.name}
                </h2>
                <p className="text-sm text-gray-400 mt-1">{ngo.email}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {ngo.address}, {ngo.city}, {ngo.state}
                </p>
              </div>

              {/* Action */}
              <div className="mt-6 flex justify-end">
                <Link
                  to={`/pending-ngos/${ngo._id}`}
                  className="bg-[#F4C752] hover:bg-[#e6b94a] text-black font-semibold px-4 py-2 rounded-lg transition"
                >
                  Review
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PendingNgosContent;
