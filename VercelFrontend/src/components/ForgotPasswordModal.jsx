import { useState } from "react";
import { requestOtp, verifyOtp, resetPassword } from "../api/resetPassword";

export default function ForgotPasswordModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOtp = async () => {
    try {
      await requestOtp(email);
      setMessage("OTP sent to your email");
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyOtp(email, otp);
      setMessage("OTP verified, please enter new password");
      setStep(3);
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword(email, newPassword);
      setMessage("Password reset successfully!");
      setTimeout(onClose, 1500); // close after success
    } catch (err) {
      setMessage(err.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Forgot Password</h2>

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border p-2 mb-4 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleSendOtp}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full border p-2 mb-4 rounded"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Verify OTP
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full border p-2 mb-4 rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              onClick={handleResetPassword}
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
            >
              Reset Password
            </button>
          </>
        )}

        {message && <p className="mt-3 text-center text-sm text-gray-700">{message}</p>}

        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 hover:underline w-full text-center"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
