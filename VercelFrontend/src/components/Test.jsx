// src/components/TokenDisplay.jsx
import React, { useState, useEffect } from "react";
import { fetchToken } from "../api/userApi";
import { useSelector } from "react-redux";

export default function TokenDisplay() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const getToken = async () => {
      try {
        const data = await fetchToken(); // call API
        setToken(data?.token || "No token received");
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    getToken();
  }, [user]); // re-fetch if user changes

  if (loading)
    return <p className="text-gray-500 text-center mt-6">Loading token...</p>;
  if (error)
    return <p className="text-red-600 text-center mt-6">Error: {error}</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-100 rounded-xl shadow-md">
      <h1 className="text-xl font-semibold mb-3 text-center">
        User Token
      </h1>
      <pre className="bg-white p-3 rounded-lg text-sm break-words whitespace-pre-wrap">
        {token}
      </pre>
    </div>
  );
}
