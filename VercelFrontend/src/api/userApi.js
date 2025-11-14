import axios from 'axios';

export const fetchUserAdHistory = async (userId) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/ads/history/${userId}`, {
    withCredentials: true,
  });
  return res.data.ads || [];
};


export const fetchAdsForUser = async (userId) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/ads/for-user/${userId}`,
    { withCredentials: true }
  );
  return res.data.ads || [];
};

export const updateUserAge = async (age) => {
  await axios.put(
    `${import.meta.env.VITE_API_URL}/auth/set-age`,
    { age },
    { withCredentials: true }
  );
};


export const addDiaryEntry = async (data) => {
  await axios.post(
    `${import.meta.env.VITE_API_URL}/diary`,
    data,
    { withCredentials: true }
  );
};
export const showDiaryEntry = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/diaryget`, {
    withCredentials: true,
  });
  return res.data;
};
export const deleteDiaryEntry = async (index) => {
  await axios.delete(
    `${import.meta.env.VITE_API_URL}/diary/${index}`,
    { withCredentials: true }
  );
};
export const getAffiliateAds = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/AffiliateAds`, {
    withCredentials: true,
  });
  return res.data;

}

export async function fetchUserCount() {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/UserCount`,{
    withCredentials:true
  });
  console.log("in api: ",res.data)
  return res.data.totalUsers;
}


export async function fetchToken() {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/Token`,
      {}, // no body
      { withCredentials: true }
    );

    console.log("token is:", res.data);

    // ✅ Store token in localStorage if exists
    if (res.data?.token) {
      localStorage.setItem("accessToken", res.data.token);
      console.log("Token saved to localStorage ✅");
    } else {
      console.warn("No token found in response ⚠️");
    }

    return res.data; // still return for use in components
  } catch (err) {
    console.error("Error fetching token:", err);
    throw err; // rethrow so frontend can handle error
  }
}