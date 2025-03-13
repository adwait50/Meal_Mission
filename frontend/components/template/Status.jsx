// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const App = () => {
  const [donations, setDonations] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Simulate backend data fetching
  useEffect(() => {
    const fetchActiveRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/donors/active-requests`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          console.log(response.data);
          setDonations(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchActiveRequests();

    // const mockDonations = [
    //   {
    //     id: "DON-2024-001",
    //     items: "Fresh Vegetables",
    //     quantity: "5kg",
    //     time: "Today, 2:00 PM",
    //     status: "In Progress",
    //   },
    //   {
    //     id: "DON-2024-002",
    //     items: "Prepared Meals",
    //     quantity: "3kg",
    //     time: "Tomorrow, 10:00 AM",
    //     status: "Scheduled",
    //   },
    //   {
    //     id: "DON-2024-003",
    //     items: "Bakery Items",
    //     quantity: "2kg",
    //     time: "Jan 17, 1:30 PM",
    //     status: "Pending",
    //   },
    //   {
    //     id: "DON-2024-004",
    //     items: "Canned Goods",
    //     quantity: "8kg",
    //     time: "Jan 18, 9:00 AM",
    //     status: "Scheduled",
    //   },
    //   {
    //     id: "DON-2024-005",
    //     items: "Fresh Fruits",
    //     quantity: "4kg",
    //     time: "Jan 19, 3:30 PM",
    //     status: "Pending",
    //   },
    // ];
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-green-600";
      case "Scheduled":
        return "bg-blue-600";
      case "Pending":
        return "bg-orange-400 ";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-[#141C25] p-8">
      <button
        onClick={() => navigate("/donor-dashboard")}
        className="mb-4 text-gray-400 hover:text-white flex items-center gap-2"
      >
        ← Back to Dashboard
      </button>
      <div className="max-w-6xl mt-9 mx-auto">
        <h2 className="text-3xl font-semibold mb-5 text-zinc-100 ">
          Active Requests
        </h2>
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Donation ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Time
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation, index) => (
                  <tr
                    key={donation.id}
                    className={`
                      border-b border-gray-700 hover:bg-gray-700/50 transition-colors
                      ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-800/50"}
                    `}
                  >
                    <td className="px-6 py-4 text-sm text-white">
                      {donation.requestId}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {donation.foodItems}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {donation.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {donation.createdAt}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`
                        px-3 py-1 text-xs font-medium rounded-full text-white
                        ${getStatusClass(donation.status)}
                      `}
                      >
                        {donation.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
