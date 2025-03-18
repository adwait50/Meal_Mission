// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState } from "react";
import AdminSideBar from "../components/AdminSideBar";

const AdminSupport = () => {
  const [selectedUserType, setSelectedUserType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const supportRequests = [
    {
      id: 1,
      userType: "ngo",
      organization: "Global Food Relief Initiative",
      contact: "Isabella Thompson",
      issue: "Platform access issues during donation registration",
      status: "pending",
      date: "2025-03-17",
      priority: "high",
    },
    {
      id: 2,
      userType: "donor",
      organization: "Fresh Harvest Restaurant",
      contact: "Alexander Mitchell",
      issue: "Unable to update donation schedule",
      status: "completed",
      date: "2025-03-16",
      priority: "medium",
    },
    {
      id: 3,
      userType: "ngo",
      organization: "Community Care Foundation",
      contact: "Oliver Anderson",
      issue: "Verification document upload failing",
      status: "pending",
      date: "2025-03-18",
      priority: "high",
    },
    {
      id: 4,
      userType: "donor",
      organization: "Green Earth Grocers",
      contact: "Sophie Williams",
      issue: "Payment integration error",
      status: "completed",
      date: "2025-03-15",
      priority: "low",
    },
  ];

  const filteredRequests = supportRequests.filter((request) => {
    const typeMatch =
      selectedUserType === "all" || request.userType === selectedUserType;
    const statusMatch =
      selectedStatus === "all" || request.status === selectedStatus;
    return typeMatch && statusMatch;
  });

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  return (
    <div className="min-h-screen bg-[#141C25] flex text-white">
      <AdminSideBar />
      <div className="flex-1 ml-[300px] ">
        <div className="min-h-screen bg-[#141C25]">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Support Requests Dashboard
            </h1>
            <p className="text-gray-400">
              Manage and track support requests from NGOs and donors
            </p>

            <div className="flex gap-4 mb-6 mt-7">
              {/* User Type Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowTypeMenu(!showTypeMenu)}
                  className="bg-gray-800 px-4 py-2 text-gray-300 flex items-center gap-2 cursor-pointer hover:bg-gray-700"
                >
                  User Type:{" "}
                  {selectedUserType.charAt(0).toUpperCase() +
                    selectedUserType.slice(1)}
                </button>
                {showTypeMenu && (
                  <div className="absolute z-10 mt-1 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
                    {["all", "ngo", "donor"].map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setSelectedUserType(type);
                          setShowTypeMenu(false);
                        }}
                        className="block w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 cursor-pointer"
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusMenu(!showStatusMenu)}
                  className="bg-gray-800 px-4 py-2 text-gray-300 flex items-center gap-2 cursor-pointer hover:bg-gray-700"
                >
                  Status:{" "}
                  {selectedStatus.charAt(0).toUpperCase() +
                    selectedStatus.slice(1)}
                </button>
                {showStatusMenu && (
                  <div className="absolute z-10 mt-1 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
                    {["all", "pending", "completed"].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedStatus(status);
                          setShowStatusMenu(false);
                        }}
                        className="block w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 cursor-pointer"
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Requests Table */}
            <table className="min-w-full divide-y divide-gray-700 bg-gray-800">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    Issue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    onClick={() => handleRequestClick(request)}
                    className="hover:bg-gray-700 cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {request.organization}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {request.userType.toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {request.issue}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {request.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Details Modal */}
            {showDetailsModal && selectedRequest && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
                  <h3 className="text-lg font-medium text-white">
                    Support Request Details
                  </h3>
                  <p className="text-gray-200">{selectedRequest.issue}</p>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="mt-4 bg-gray-700 px-4 py-2 text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;
