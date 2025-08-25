import React from "react";

function PickupConfirm({ requestId }) {
  return (
    <div className="text-white p-4 sm:p-6 max-w-md mx-auto text-center">
      {/* Heading */}
      <h2 className="text-lg sm:text-xl font-semibold mb-3">
        Pickup Request Submitted!
      </h2>

      {/* Description */}
      <p className="text-gray-300 text-sm sm:text-base">
        Your request for food pickup has been successfully submitted.
      </p>
      <p className="text-gray-300 text-sm sm:text-base">
        Thank you for your generosity!
      </p>

      {/* Request ID */}
      <p className="mt-3 text-sm sm:text-base">
        Request Id -{" "}
        <span className="font-semibold text-[#F4C752]">{requestId}</span>
      </p>
    </div>
  );
}

export default PickupConfirm;
