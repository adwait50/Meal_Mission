import React from "react";
import { useParams } from "react-router";

function RequestDetail() {
  const { donationId } = useParams();
  console.log(donationId);
  return <div>RequestDetail</div>;
}

export default RequestDetail;
