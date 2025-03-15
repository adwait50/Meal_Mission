import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Modal from "../components/Modal";
import NgoApproved from "../components/template/NgoApproved";

function PendingNgosDetail() {
  const { ngoId } = useParams();
  const [pendingNgo, setPendingNgo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flag, setFlag] = useState(false);

  const fetchPendingNgo = async () => {
    try {
      const token = localStorage.getItem("Admintoken");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/admin/${ngoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setPendingNgo(response.data);
      }
    } catch (error) {
      console.error(error);
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(response);
        fetchPendingNgo();
        setIsModalOpen(true);
        setFlag(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const rejectPendingNgo = async () => {
    try {
      const token = localStorage.getItem("Admintoken");
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/admin/reject-ngo/${ngoId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(response);
        fetchPendingNgo();
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex-1 ml-[300px] min-h-screen p-6">
      <h1 className="text-3xl font-semibold">Details of Pending NGO</h1>
      <div className="bg-[#364153] h-full flex flex-col gap-5 mt-5 w-full p-4">
        {pendingNgo ? (
          <>
            <h2 className="text-xl">{pendingNgo.name}</h2>
            <p>Email: {pendingNgo.email}</p>
            <p>Address: {pendingNgo.address}</p>
            <p>Document Proof: {pendingNgo.documentProof}</p>
            <p>State: {pendingNgo.state}</p>
            <p>State: {pendingNgo.city}</p>
            <p>Approved: {pendingNgo.isApproved ? "Yes" : "No"}</p>
            <p>Verified: {pendingNgo.isVerified ? "Yes" : "No"}</p>
            <div>
              <button
                onClick={() => approvePendingNgo()}
                className="bg-[#F4C752] text-black px-2 py-2 rounded-lg cursor-pointer font-semibold "
              >
                {" "}
                Approve Ngo{" "}
              </button>
              <button
                onClick={() => rejectPendingNgo()}
                className="bg-[#141C25] ml-4 px-2 py-2 rounded-lg cursor-pointer font-semibold "
              >
                {" "}
                Reject Ngo{" "}
              </button>
            </div>
          </>
        ) : (
          <p>No details available.</p>
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NgoApproved ngoId={pendingNgo.name} flag={flag} />
      </Modal>
    </div>
  );
}

export default PendingNgosDetail;
