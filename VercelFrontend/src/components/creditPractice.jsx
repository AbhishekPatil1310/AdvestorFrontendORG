import { useEffect, useRef } from 'react';
import { fetchMyAds, updateCredit } from '../api/addApi';
import { fetchUserProfile } from '../api/getProfile';

export default function GlobalCreditWatcher({ pollingInterval = 5000 }) {
  const prevViewsRef = useRef(null); // Track previous total views
  const creditRef = useRef(0);       // Local credit snapshot
  const userRef = useRef(null);      // Cached user info

  useEffect(() => {
    let intervalId;

    const fetchAndUpdate = async () => {
      try {
        // Fetch user details once
        if (!userRef.current) {
          const user = await fetchUserProfile();
          if (!user || user.role !== 'advertiser') return;

          userRef.current = user;
          creditRef.current = user.credit || 0;
        }

        // Fetch current ads and compute total views
        const ads = await fetchMyAds();
        const totalViews = ads.reduce((sum, ad) => sum + (ad.views || 0), 0);

        // First run, just store the view count
        if (prevViewsRef.current === null) {
          prevViewsRef.current = totalViews;
          return;
        }

        // Determine new views since last check
        const newViews = totalViews - prevViewsRef.current;

        if (newViews > 0) {
          const cost = newViews * 0.5;

          const res = await updateCredit(creditRef.current - cost); // Pass updated credit

          // Update refs from server response
          creditRef.current = res.credit;
          userRef.current.totalSpent = res.totalSpent;
          userRef.current.monthlySpent = res.monthlySpent;

          prevViewsRef.current = totalViews;
        }
      } catch (err) {
        console.error('GlobalCreditWatcher Error:', err);
      }
    };

    fetchAndUpdate(); // Run immediately
    intervalId = setInterval(fetchAndUpdate, pollingInterval); // Polling

    return () => clearInterval(intervalId); // Cleanup
  }, [pollingInterval]);

  return null; // No UI
}
