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
        console.log(response.data);
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
    <div className="flex-1 ml-[300px] p-9">
      <h1 className="text-3xl text-zinc-200 font-semibold">Pending NGOs</h1>
      <div className="min-h-screen px-6 flex flex-col gap-2 mt-10">
        {pendingNgos.length === 0 ? (
          <p className="text-lg text-red-500">No NGOs to approve.</p>
        ) : (
          pendingNgos.map((ngo) => (
            <div
              key={ngo._id}
              className="w-full p-4 flex rounded-lg bg-[#364153] py-5 mb-2"
            >
              <div className="flex gap-3 w-full">
                <div className="flex flex-col w-7/10">
                  {" "}
                  <h3 className="text-lg">{ngo.name}</h3>
                  <h3 className="text-lg">{ngo.email}</h3>
                  <h3 className="text-lg">{ngo.address}</h3>
                </div>
                <div className="flex justify-center items-center w-3/10">
                  {" "}
                  <Link
                    to={`/pending-ngos/${ngo._id}`}
                    className="bg-[#F4C752] px-3 py-2 font-semibold rounded-lg text-black"
                  >
                    More info
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PendingNgosContent;
