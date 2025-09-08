// src/components/NoUpiPopup.jsx
import { useNavigate } from "react-router-dom";

export default function NoUpiPopup({ onClose }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm text-center">
        <h3 className="text-lg font-semibold text-gray-800">No UPI ID Found</h3>
        <p className="text-sm text-gray-600 mt-2">
          Please add your UPI ID in profile settings to proceed with withdrawal.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => navigate("/edit-profile")}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Go to Profile
          </button>
        </div>
      </div>
    </div>
  );
}
