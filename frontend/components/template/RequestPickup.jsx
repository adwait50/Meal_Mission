import { useNavigate } from "react-router-dom";
import { useDonor } from "../../context/DonorContext";

function RequestPickup() {
  const navigate = useNavigate();
  const { donorData } = useDonor();

  return (
    <div className="w-full flex-1 flex flex-col gap-5 px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate("/donor-dashboard")}
        className="mb-4 text-gray-400 hover:text-white flex items-center gap-2"
      >
        ← Back to Dashboard
      </button>

      <div className="bg-[#364153] rounded-2xl p-7">
        <h1 className="text-2xl font-semibold mb-6">Request Food Pickup</h1>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Pickup Address
            </label>
            <input
              type="text"
              defaultValue={donorData?.address}
              className="w-full p-3 bg-[#141C25] rounded-lg border border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Food Description
            </label>
            <textarea
              className="w-full p-3 bg-[#141C25] rounded-lg border border-gray-600"
              rows="4"
            />
          </div>

          <button
            type="submit"
            className="bg-[#F4C752] px-6 py-3 text-black rounded-lg 
              transform transition-transform duration-200 hover:scale-105"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}

export default RequestPickup;
