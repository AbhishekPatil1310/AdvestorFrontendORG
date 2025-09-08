import React, { useEffect, useState } from 'react';
import {
  getAffiliateAds,
  addAffiliateAd,
  updateAffiliateAd,
  deleteAffiliateAd,
} from '../api/adminApi';

export default function AdminAffiliateAds() {
  const initialFormState = {
    name: '',
    discrption: '',
    price: '',
    ImageUrl: '',
    AffiliateLink: ''
  };

  const [ads, setAds] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAds = async () => {
    try {
      const data = await getAffiliateAds();
      setAds(data);
    } catch (err) {
      console.error('Error fetching ads:', err);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await updateAffiliateAd(editingId, form);
      } else {
        await addAffiliateAd(form);
      }
      setForm(initialFormState);
      setEditingId(null);
      fetchAds();
    } catch (err) {
      console.error('Error submitting ad:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ad) => {
    setForm({
      name: ad.name || '',
      discrption: ad.discrption || '',
      price: ad.price || '',
      ImageUrl: ad.ImageUrl || '',
      AffiliateLink: ad.AffiliateLink || ''
    });
    setEditingId(ad._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this ad?')) return;
    try {
      await deleteAffiliateAd(id);
      fetchAds();
    } catch (err) {
      console.error('Error deleting ad:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        {editingId ? 'Edit Affiliate Ad' : 'Add New Affiliate Ad'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="discrption"
          value={form.discrption}
          onChange={handleChange}
          placeholder="Description"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="ImageUrl"
          value={form.ImageUrl}
          onChange={handleChange}
          placeholder="Image URL"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="AffiliateLink"
          value={form.AffiliateLink}
          onChange={handleChange}
          placeholder="Affiliate Link"
          required
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? 'Saving...' : editingId ? 'Update Ad' : 'Add Ad'}
        </button>
      </form>

      <h3 className="text-xl mt-8 mb-2 font-semibold">Current Ads</h3>
      <div className="space-y-4">
        {ads.map((ad) => (
          <div key={ad._id} className="border p-4 rounded bg-gray-50 shadow">
            <div className="flex justify-between items-center gap-4">
              <div>
                <h4 className="font-bold text-lg">{ad.name}</h4>
                <p className="text-sm">{ad.discrption}</p>
                <p className="text-green-600 font-semibold">₹ {ad.price}</p>
                <a
                  href={ad.AffiliateLink}
                  className="text-blue-500 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Product
                </a>
              </div>
              <img
                src={ad.ImageUrl}
                alt={ad.name}
                className="w-24 h-24 object-cover rounded border"
              />
            </div>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleEdit(ad)}
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(ad._id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
