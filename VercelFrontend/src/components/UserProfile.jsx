import React, { useEffect, useState } from 'react';
import { fetchUserProfile } from '../api/getProfile';
import { Mail, Clock, Heart, Edit, ArrowLeft,X } from 'lucide-react'; // Changed Pencil to Edit, added ArrowLeft
import EditProfile from './EditProfile';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      // Simulate API call delay for better loading state visualization
      // await new Promise(resolve => setTimeout(resolve, 1000));
      const data = await fetchUserProfile();
      if (data) setProfile(data);
    }
    loadProfile();
  }, []);

  // Function to refresh profile data after editing
  const handleProfileUpdate = async () => {
    const data = await fetchUserProfile();
    if (data) setProfile(data);
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex items-center space-x-3 text-lg text-gray-600">
          <svg className="animate-spin h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/dashboard')}
          className="mb-8 flex items-center gap-2 text-indigo-700 hover:text-indigo-900 font-medium px-4 py-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </motion.button>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-10"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-4xl font-extrabold text-indigo-800 leading-tight">
              Hello, <span className="text-purple-600">{profile.name}</span>!
            </h2>
            <motion.button
              onClick={() => setShowEditor(true)}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white font-semibold rounded-full shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Edit size={20} />
              Edit Profile
            </motion.button>
          </div>

          <div className="space-y-8">
            {/* Email Section */}
            <div className="flex items-center gap-4 text-gray-700">
              <div className="p-3 bg-indigo-100 rounded-full">
                <Mail className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-500">Email Address</h3>
                <span className="text-xl font-semibold">{profile.email}</span>
              </div>
            </div>

            {/* Preferred Time Section */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Preferred Time</h3>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, staggerChildren: 0.1 }}
                className="flex flex-wrap gap-3"
              >
                {profile.time && profile.time.length > 0 ? (
                  profile.time.map((t, i) => (
                    <motion.span
                      key={i}
                      className="bg-blue-50 text-blue-800 text-base font-medium px-5 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.03 }}
                    >
                      {t}
                    </motion.span>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No preferred times set.</p>
                )}
              </motion.div>
            </div>

            {/* Interests Section */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-pink-100 rounded-full">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Interests</h3>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, staggerChildren: 0.1 }}
                className="flex flex-wrap gap-3"
              >
                {profile.interests && profile.interests.length > 0 ? (
                  profile.interests.map((interest, i) => (
                    <motion.span
                      key={i}
                      className="bg-pink-50 text-pink-800 text-base font-medium px-5 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.03 }}
                    >
                      {interest}
                    </motion.span>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No interests selected.</p>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Slide-out Canvas for EditProfile */}
      <AnimatePresence>
        {showEditor && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 sm:left-auto sm:w-[500px] h-full bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shadow-sm sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-indigo-700">Edit Profile</h2>
              <motion.button
                onClick={() => {
                  setShowEditor(false);
                  handleProfileUpdate(); // Refresh profile data after closing editor
                }}
                className="p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>
            </div>
            <div className="p-6">
              <EditProfile onClose={() => {
                setShowEditor(false);
                handleProfileUpdate();
              }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}