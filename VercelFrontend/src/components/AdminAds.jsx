// src/components/AdvertiserAds.jsx
import React, { useEffect, useState } from 'react';
import { adForAdmin, deleteAdById } from '../api/adminApi';

export default function AdvertiserAds({ advertiserId, onClose }) {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await adForAdmin(advertiserId);
        setAds(res.data.ads || []);
        console.log('advertiser Id:', advertiserId);
      } catch (err) {
        console.error('Error fetching ads:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, [advertiserId]);

  const handleDelete = async (adId) => {
    const confirm = window.confirm('Are you sure you want to delete this ad?');
    if (!confirm) return;

    try {
      await deleteAdById(adId);
      setAds((prev) => prev.filter((ad) => ad._id !== adId));
    } catch (err) {
      console.error('Error deleting ad:', err);
      alert('Failed to delete ad');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
        <div className="bg-white/80 rounded-lg px-6 py-4 shadow-xl">
          <p className="text-indigo-600 font-medium">Loading ads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-900/50 via-purple-900/30 to-blue-900/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white/80 backdrop-blur-md rounded-xl shadow-2xl p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-indigo-700">📢 Advertiser's Ads</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-500 text-xl">✖</button>
        </div>

        {ads.length === 0 ? (
          <p className="text-gray-700">No ads available.</p>
        ) : (
          ads.map((ad) => (
            <div key={ad._id} className="bg-white/90 border border-gray-300 rounded-lg p-4 shadow-md space-y-3">
              <div className="flex flex-col sm:flex-row gap-4">
                <img
                  src={ad.imageUrl}
                  alt="Ad visual"
                  className="w-full sm:w-52 h-40 object-cover rounded-lg shadow"
                />
                <div className="flex-1 space-y-1">
                  <p><strong>Description:</strong> {ad.description}</p>
                  <p><strong>Type:</strong> {ad.adType}</p>
                  <p><strong>Views:</strong> {ad.views}</p>
                  <p><strong>Target Age:</strong> {ad.targetAgeGroup?.min} - {ad.targetAgeGroup?.max}</p>
                  <p><strong>Created:</strong> {new Date(ad.createdAt).toLocaleString()}</p>
                  <p><strong>Updated:</strong> {new Date(ad.updatedAt).toLocaleString()}</p>
                </div>
              </div>

              {ad.feedbacks && ad.feedbacks.length > 0 && (
                <div className="mt-2">
                  <h4 className="font-semibold text-indigo-600">🗣️ Feedbacks:</h4>
                  <ul className="pl-4 list-disc text-gray-700 space-y-1">
                    {ad.feedbacks.map((fb) => (
                      <li key={fb._id}>
                        <strong>{fb.userName}</strong>: {fb.comment} ({fb.sentiment})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="text-right">
                <button
                  onClick={() => handleDelete(ad._id)}
                  className="mt-2 px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition"
                >
                  🗑️ Delete Ad
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
