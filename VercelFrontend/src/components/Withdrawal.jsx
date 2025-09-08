// src/components/WithdrawalForm.jsx
import { useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store";
import { withdrawRequest } from "../api/adminApi";
import NoUpiPopup from "./NoupiPopup";

export default function WithdrawalForm() {
  const dispatch = useAppDispatch();
  const user = useSelector((state) => state.auth.user);
  console.log("user in withdrawal is: ",user)

  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user?.upiId) {
      setShowPopup(true);
      return;
    }

    const withdrawAmount = parseFloat(amount);

    if (!withdrawAmount || withdrawAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (withdrawAmount > user.credit) {
      setError("Insufficient credits.");
      return;
    }

    try {
      setLoading(true);
      await withdrawRequest({
        name: user.name,
        email: user.email,
        upiId: user.upiId,
        amount: withdrawAmount,
        currentCredit:user.credit,
      });
      setSuccess("Withdrawal request submitted successfully ✅");
      setAmount("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <>
      {/* Main Form */}
      <form
        onSubmit={handleWithdraw}
        className="max-w-md mx-auto p-6 bg-white shadow rounded-xl space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-800">Withdraw Credits</h2>

        <p className="text-sm text-gray-600">
          Available Credits: <span className="font-bold">{user?.credits}</span>
        </p>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter withdrawal amount"
          className="w-full border rounded px-3 py-2 focus:ring focus:ring-indigo-200"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Withdraw"}
        </button>
      </form>

      {/* Popup */}
      {showPopup && <NoUpiPopup onClose={() => setShowPopup(false)} />}
    </>
  );
}
