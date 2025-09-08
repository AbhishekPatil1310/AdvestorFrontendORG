import React, { useEffect, useState } from 'react';
import { getAffiliateAds } from '../api/userApi';
import AffiliateProductCard from './CardForAffiliat';

export default function AffiliateAdsDisplay() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAds() {
      try {
        const data = await getAffiliateAds();
        setAds(data);
      } catch (err) {
        console.error('Failed to load ads:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAds();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-10">Loading affiliate ads...</div>
    );
  }

  if (ads.length === 0) {
    return (
      <div className="text-center text-gray-400 py-10">No affiliate products available.</div>
    );
  }

return (
  <section className="relative w-full px-6 py-12 bg-gradient-to-br from-purple-100 via-white to-blue-100">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-10 drop-shadow-sm">
        🌟 Featured Products
      </h2>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {ads.map((ad) => (
          <AffiliateProductCard
            key={ad._id}
            product={{
              title: ad.name,
              image: ad.ImageUrl,
              price: `₹ ${ad.price}`,
              link: ad.AffiliateLink,
            }}
          />
        ))}
      </div>
    </div>

    {/* Optional background bubbles for aesthetics */}
    <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-200 rounded-full opacity-30 blur-2xl animate-pulse"></div>
    <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-2xl animate-pulse"></div>
  </section>
);

}
