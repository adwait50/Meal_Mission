import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Modal from "../components/Modal";
import NgoApproved from "../components/template/NgoApproved";

function PendingNgosDetail() {
  const { ngoId } = useParams();
  const [pendingNgo, setPendingNgo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const fetchPendingNgo = async () => {
    try {
      const token = localStorage.getItem("Admintoken");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/admin/ngo-info/${ngoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) setPendingNgo(response.data);
    } catch (error) {
      setError("Failed to fetch NGO details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingNgo();
  }, [ngoId]);

  const approvePendingNgo = async () => {
    try {
      const token = localStorage.getItem("Admintoken");
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/admin/approve-ngo/${ngoId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        fetchPendingNgo();
        setStatusMessage(`${pendingNgo?.name} was approved successfully ✅`);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const rejectPendingNgo = async () => {
    try {
      const token = localStorage.getItem("Admintoken");
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/admin/reject-ngo/${ngoId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        fetchPendingNgo();
        setStatusMessage(`${pendingNgo?.name} was rejected ❌`);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p className="ml-[300px] p-6 text-gray-400">Loading...</p>;
  if (error) return <p className="ml-[300px] p-6 text-red-500">{error}</p>;

  return (
    <div className="flex-1 ml-[300px] min-h-screen p-8 bg-[#141C25] text-white">
      <h1 className="text-3xl font-semibold mb-8">Pending NGO Details</h1>

      {pendingNgo ? (
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-10">
          {/* NGO Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">{pendingNgo.name}</h2>
            <p className="mt-2 text-gray-300">📧 {pendingNgo.email}</p>
            <p className="mt-1 text-gray-300">
              📍 {pendingNgo.address}, {pendingNgo.city}, {pendingNgo.state}
            </p>
            <p className="mt-1 text-gray-400">
              ✅ Verified: {pendingNgo.isVerified ? "Yes" : "No"}
            </p>
            <p className="mt-1 text-gray-400">
              🏷 Approved: {pendingNgo.isApproved ? "Yes" : "No"}
            </p>

            {/* Actions */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={approvePendingNgo}
                className="bg-[#F4C752] hover:bg-[#e6b94a] text-black px-5 py-2 rounded-lg font-semibold transition"
              >
                Approve
              </button>
              <button
                onClick={rejectPendingNgo}
                className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-semibold transition"
              >
                Reject
              </button>
            </div>
          </div>

          {/* Document Preview */}
          <div className="flex-1 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-3">Document Proof</h3>
            {pendingNgo.documentProof ? (
              <img
                src={`${import.meta.env.VITE_BASE_URL}/${pendingNgo.documentProof}`}
                alt="NGO Document"
                className="w-full max-w-md rounded-lg shadow-md border border-gray-700"
              />
            ) : (
              <p className="text-gray-400">No document uploaded.</p>
            )}
          </div>
        </div>
      ) : (
        <p>No details available.</p>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="text-center">
          <h2 className="text-xl font-semibold">{statusMessage}</h2>
        </div>
      </Modal>
    </div>
  );
}

export default PendingNgosDetail;
