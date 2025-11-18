import { useEffect, useState } from 'react';
import { fetchUserProfile, updateUserLocation } from '../api/getProfile';

export default function useLocationHandler() {
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    async function initializeLocationState() {
      try {
        const user = await fetchUserProfile();
        if (user) {
          // Check location status from user profile
          setLocationEnabled(Boolean(user.locationEnabled));

          // Show popup only if address isn't set
          if (!user?.Useraddress?.fullAddress) {
            setShowPopup(true);
          } else {
            handleBackgroundLocationUpdate(user.lastLocationUpdate);
          }
        }
      } catch (error) {
        console.error('Error initializing location:', error);
      }
    }

    initializeLocationState();
  }, []);

  const handleBackgroundLocationUpdate = async (lastUpdate) => {
    const ONE_DAY = 24 * 60 * 60 * 1000;
    if (!lastUpdate || Date.now() - new Date(lastUpdate).getTime() > ONE_DAY) {
      fetchLocationAndUpdate();
      console.log('location updated✔️: ',lastUpdate)
    }
  };

  const fetchLocationAndUpdate = () => {
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const { latitude, longitude } = coords;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
        );
        const data = await res.json();

        await updateUserLocation({
          Latitude: latitude,
          Longitude: longitude,
          fullAddress: data.display_name,
          road: data.address.road || 'N/A',
          city: data.address.city || 'N/A',
          state: data.address.state || 'N/A',
          postcode: data.address.postcode || 'N/A',
          country: data.address.country || 'N/A',
        });

        setLocationEnabled(true);
      } catch (error) {
        console.error('Failed to update location:', error);
      }
    });
  };

  const toggleLocationPopup = () => setShowPopup(true);

  const handleLocationFetched = async (address) => {
    await updateUserLocation(address);
    setShowPopup(false);
    setLocationEnabled(true);
  };

  return {
    locationEnabled,
    showPopup,
    toggleLocationPopup,
    handleLocationFetched,
    setShowPopup,
  };
}
