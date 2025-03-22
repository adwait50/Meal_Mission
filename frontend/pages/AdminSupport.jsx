// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from "react";
import AdminSideBar from "../components/AdminSideBar";
import axios from "axios";
import { useNavigate } from "react-router";

const AdminSupport = () => {
  const [selectedUserType, setSelectedUserType] = useState("all");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [supportRequests, setSupportRequests] = useState([]);
  const [isCompleted, setIsCompleted] = useState("all");
  const navigate = useNavigate();

  const fetchrequests = async () => {
    try {
      const token = localStorage.getItem("Admintoken");
      const response = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/admin/${selectedUserType}-support`,
        {
          params: {
            isCompleted: isCompleted,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(response.data);
        setSupportRequests(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    console.log("Updated support requests:", supportRequests);
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
        `${import.meta.env.VITE_BASE_URL}/api/admin/complete-request/${
          request.type
        }/${request._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        console.log(response.data);
        const updatedRequest = response.data; // Get the updated request
        // Update the local state to reflect the change
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
                {supportRequests.map((request) => (
                  <tr
                    key={request._id}
                    onClick={() => handleRequestClick(request)}
                    className="hover:bg-gray-700 cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {request._id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {request.type.toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {request.issue}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm text-gray-200 font-semibold ${
                        request.isCompleted
                          ? "text-sky-600 "
                          : "text-orange-600"
                      }  `}
                    >
                      {request.isCompleted ? "Completed" : "Pending"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {request.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Details Modal */}
            {showDetailsModal && selectedRequest && (
              <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                <div className="relative bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full m-4">
                  <div className="px-6 py-4 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-medium text-white">
                        Support Request Details
                      </h3>
                      <button
                        onClick={() => setShowDetailsModal(false)}
                        className="text-gray-400 hover:text-gray-300 cursor-pointer"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                  <div className="px-6 py-4  ">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-lg font-medium text-gray-400">
                          Organization Name
                        </p>
                        <p className="mt-1 text-md text-gray-200">Name</p>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-400">
                          Organization Id
                        </p>
                        <p className="mt-1 text-md text-gray-200">
                          {selectedRequest._id}
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-400">
                          Organization type
                        </p>
                        <p className="mt-1 text-md text-gray-200">
                          {selectedRequest.type}
                        </p>
                      </div>
                      <div className="">
                        <p className="text-lg font-medium text-gray-400">
                          Issue
                        </p>
                        <p className="mt-1 text-md text-gray-200">
                          {selectedRequest.issue}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-lg font-medium text-gray-400">
                          Description
                        </p>
                        <p className="mt-1 text-md text-gray-200">
                          {selectedRequest.description}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-lg font-medium text-gray-400">
                          Contact detail
                        </p>
                        <p className="mt-1 text-md text-gray-200">
                          {selectedRequest.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-500">
                          Status
                        </p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium mt-1 ${
                            selectedRequest.isCompleted
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {selectedRequest.isCompleted
                            ? "Completed"
                            : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4 border-t border-gray-700">
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => setShowDetailsModal(false)}
                        className="!rounded-button bg-gray-700 border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600 cursor-pointer"
                      >
                        Close
                      </button>
                      {selectedRequest.isCompleted === false && (
                        <button
                          onClick={() => completeRequest(selectedRequest)}
                          className="!rounded-button bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 cursor-pointer"
                        >
                          Mark as Completed
                        </button>
                      )}
                    </div>
                  </div>
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
