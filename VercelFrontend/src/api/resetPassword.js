import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // adjust if different

export async function requestOtp(email) {
  return axios.post(`${API_URL}/forgot-password`, { email });
}

export async function verifyOtp(email, otp) {
  return axios.post(`${API_URL}/Fverify-otp`, { email, otp });
}

export async function resetPassword(email, newPassword) {
  return axios.post(`${API_URL}/reset-password`, { email, newPassword });
}
