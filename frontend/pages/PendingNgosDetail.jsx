import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function PendingNgosDetail() {
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
        // console.log(response.data);
        setPendingNgos(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  console.log(pendingNgos);
  useEffect(() => {
    fetchPendingNgo();
  }, []);
  return (
    <div className="flex-1 ml-[300px] min-h-screen p-6">
      <h1 className="text-3xl font-semibold ">Details of Pending NGO</h1>
      <div className="bg-[#364153] h-full mt-5 w-full">
        <h2>NGO Name</h2>
        <h2>{}</h2>
      </div>
    </div>
  );
}

export default PendingNgosDetail;
