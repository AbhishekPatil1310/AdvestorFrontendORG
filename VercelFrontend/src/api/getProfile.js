import axios from 'axios';

export async function fetchUserProfile() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/profile`, {
      withCredentials: true,
      
    });
    return res.data;
  } catch (err) {
    console.error('Profile fetch failed:', err);
    return null;
  }
}

export async function updateUserLocation(locationData) {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/location`,
      locationData,
      { withCredentials: true }  // Send session cookie
      
    );
    console.log("the data location is: ",locationData)
    console.log('Location updated on API:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating location:', error);
    throw error;
  }
}


