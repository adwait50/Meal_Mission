import React from "react";

function PickupConfirm({ requestId }) {
  return (
    <div className="text-white">
      <h2 className="text-lg font-semibold mb-2 ">Pickup Request Submitted!</h2>
      <p className="text-zinc-300">
        Your request for food pickup has been successfully submitted.
      </p>
      <p className="text-zinc-300">Thank you for your generosity!</p>
      <p className="mt-2">
        Request Id- <span className="font-semibold"> {requestId}</span>{" "}
      </p>
    </div>
  );
}

export default PickupConfirm;
