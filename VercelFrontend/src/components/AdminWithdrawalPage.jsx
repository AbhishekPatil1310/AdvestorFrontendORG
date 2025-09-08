import { useEffect, useState } from "react";
import {
  getWithdrawals,
  updateWithdrawal,
  updateAllWithdrawals,
} from "../api/adminApi";
import * as XLSX from "xlsx";

export default function WithdrawalAdmin() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch withdrawals on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getWithdrawals();
      setWithdrawals(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load withdrawals");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, status) => {
    try {
      await updateWithdrawal(id, status);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to update withdrawal");
    }
  };

  const handleBulkUpdate = async (status) => {
    try {
      await updateAllWithdrawals(status);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to bulk update withdrawals");
    }
  };

  const handleExportExcel = () => {
    const exportData = withdrawals.map((w) => ({
      Name: w.name,
      Email: w.email,
      Amount: w.amount,
      UPI: w.upiId,
      Status: w.status,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Withdrawals");
    XLSX.writeFile(wb, "withdrawals.xlsx");
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Withdrawal Requests</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Bulk update buttons */}
          <div className="mb-4 flex gap-3">
            <button
              onClick={() => handleBulkUpdate("approved")}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Approve All
            </button>
            <button
              onClick={() => handleBulkUpdate("rejected")}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Reject All
            </button>
            <button
              onClick={handleExportExcel}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Export Excel
            </button>
          </div>

          {/* Withdrawals Table */}
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">UPI ID</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr key={w._id} className="text-center border-t">
                  <td className="p-2 border">{w.name}</td>
                  <td className="p-2 border">{w.email}</td>
                  <td className="p-2 border">{w.upiId}</td>
                  <td className="p-2 border">₹{w.amount}</td>
                  <td className="p-2 border">{w.status}</td>
                  <td className="p-2 border flex gap-2 justify-center">
                    <button
                      onClick={() => handleUpdate(w._id, "approved")}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdate(w._id, "rejected")}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
