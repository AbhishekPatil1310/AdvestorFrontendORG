// src/components/InsufficientBalancePopup.jsx
export default function InsufficientBalancePopup({ onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
        <h2 className="text-lg font-semibold text-red-600 mb-4">
          Insufficient Balance
        </h2>
        <p className="text-gray-700 mb-6">
          You don’t have enough credits to withdraw this amount.
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Okay
        </button>
      </div>
    </div>
  );
}
