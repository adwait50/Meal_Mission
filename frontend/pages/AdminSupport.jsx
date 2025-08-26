// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from "react";
import AdminSideBar from "../components/AdminSideBar";
import axios from "axios";

const AdminSupport = () => {
  const [selectedUserType, setSelectedUserType] = useState("all");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [supportRequests, setSupportRequests] = useState([]);
  const [isCompleted, setIsCompleted] = useState("all");
  const [searchTerm, setSearchTerm] = useState(""); // NEW

  const fetchrequests = async () => {
    try {
      const token = localStorage.getItem("Admintoken");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/admin/${selectedUserType}-support`,
        {
          params: { isCompleted },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setSupportRequests(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchrequests();
  }, [selectedUserType, isCompleted]);

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const completeRequest = async (request) => {
    try {
      const token = localStorage.getItem("Admintoken");
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/api/admin/complete-request/${request.type}/${request._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        const updatedRequest = response.data;
        setSupportRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === updatedRequest._id ? updatedRequest : req
          )
        );
        setShowDetailsModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Filter requests based on search term
  const filteredRequests = supportRequests.filter((request) => {
    const lowerSearch = searchTerm.toLowerCase();
    const formattedDate = new Date(request.createdAt)
      .toLocaleDateString()
      .toLowerCase();

    return (
      request.requestId?.toLowerCase().includes(lowerSearch) ||
      request._id?.toLowerCase().includes(lowerSearch) ||
      formattedDate.includes(lowerSearch)
    );
  });

  return (
    <div className="min-h-screen bg-[#141C25] flex pb-14 text-white">
      <AdminSideBar />
      <div className="flex-1 md:ml-[300px]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Support Requests Dashboard
          </h1>
          <p className="text-gray-400">
            Manage and track support requests from NGOs and donors
          </p>

          {/* Filters + Search */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-7 mb-6">
            <div className="flex flex-wrap gap-4">
              <select
                onChange={(e) => setSelectedUserType(e.target.value)}
                value={selectedUserType}
                className="bg-gray-700 text-white border border-gray-600 rounded p-2"
              >
                <option value="all">All</option>
                <option value="donor">Donor</option>
                <option value="ngo">NGO</option>
              </select>

              <select
                onChange={(e) => setIsCompleted(e.target.value)}
                value={isCompleted}
                className="bg-gray-700 text-white border border-gray-600 rounded p-2"
              >
                <option value="all">All</option>
                <option value="true">Completed</option>
                <option value="false">Pending</option>
              </select>
            </div>

            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search by Request ID or Date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F4C752]"
            />
          </div>

          {/* Table for desktop */}
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-700 bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">
                    Request ID
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
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <tr
                      key={request._id}
                      onClick={() => handleRequestClick(request)}
                      className="hover:bg-gray-700 cursor-pointer"
                    >
                      <td className="px-6 py-4 text-sm text-gray-200">
                        {request.requestId}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-200">
                        {request.type.toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-200">
                        {request.issue}
                      </td>
                      <td
                        className={`px-6 py-4 text-sm font-semibold ${
                          request.isCompleted
                            ? "text-sky-500"
                            : "text-orange-500"
                        }`}
                      >
                        {request.isCompleted ? "Completed" : "Pending"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-6 text-gray-400 text-sm"
                    >
                      🚫 No requests match your search
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Card view for mobile */}
          <div className="grid gap-4 md:hidden">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <div
                  key={request._id}
                  onClick={() => handleRequestClick(request)}
                  className="bg-gray-800 rounded-lg shadow-md p-4 hover:bg-gray-700 cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{request.issue}</h3>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        request.isCompleted
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {request.isCompleted ? "Completed" : "Pending"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Type: {request.type.toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-400">
                    Org ID: {request.requestId}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-6 text-sm">
                🚫 No requests match your search
              </p>
            )}
          </div>

          {/* Details Modal (unchanged) */}
          {showDetailsModal && selectedRequest && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="relative bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full">
                <div className="px-6 py-4 border-b border-gray-700 flex justify-between">
                  <h3 className="text-xl font-medium text-white">
                    Support Request Details
                  </h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
                <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Organization Id</p>
                    <p className="text-gray-200">{selectedRequest.requestId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Type</p>
                    <p className="text-gray-200">{selectedRequest.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium mt-1 ${
                        selectedRequest.isCompleted
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedRequest.isCompleted ? "Completed" : "Pending"}
                    </span>
                  </div>
                  <div className="md:col-span-3">
                    <p className="text-sm text-gray-400">Issue</p>
                    <p className="text-gray-200">{selectedRequest.issue}</p>
                  </div>
                  <div className="md:col-span-3">
                    <p className="text-sm text-gray-400">Description</p>
                    <p className="text-gray-200">
                      {selectedRequest.description}
                    </p>
                  </div>
                  <div className="md:col-span-3">
                    <p className="text-sm text-gray-400">Contact</p>
                    <p className="text-gray-200">{selectedRequest.email}</p>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-700 flex justify-end gap-3">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-gray-300"
                  >
                    Close
                  </button>
                  {!selectedRequest.isCompleted && (
                    <button
                      onClick={() => completeRequest(selectedRequest)}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;
