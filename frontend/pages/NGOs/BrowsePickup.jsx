import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function BrowsePickup() {
  const [requests, setRequests] = useState([]);
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("Ngotoken");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/ngo/food-pickup-requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        // console.log(response.data);
        setRequests(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // console.log(requests);
  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="flex-1  p-9">
      <h1 className="text-3xl text-zinc-200 font-semibold">
        Pickup requests from your area
      </h1>
      <div className="min-h-screen px-6 flex flex-col gap-2 mt-10">
        {requests.length === 0 ? (
          <p className="text-lg text-red-500">No request found.</p>
        ) : (
          requests.map((request) => (
            <div
              key={request._id}
              className="w-full p-4 flex rounded-lg bg-[#364153] py-5 mb-2"
            >
              <div className="flex gap-3 w-full">
                <div className="flex flex-col w-7/10">
                  {" "}
                  <h3 className="text-lg">{request.address}</h3>
                  <h3 className="text-lg">{request.quantity}</h3>
                  <h3 className="text-lg">{request.foodItems}</h3>
                </div>
                <div className="flex justify-center items-center w-3/10">
                  {" "}
                  <Link
                    to={`/ngo-dashboard/donation/${request._id}`}
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

export default BrowsePickup;
