import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PublicLayout from './layout/PublicLayout';
import DashboardLayout from './layout/DashboardLayout';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import NotFoundPage from './pages/NotFound';
import UploadAd from './pages/upload';
import WatchAd from './pages/WatchAdd';
import AdvertiserDashboard from './pages/AdvertiserDashboard';
import History from './pages/Histry';
import ContactForm from './components/Contact';
import EditProfile from './components/EditProfile';
import UserProfile from './components/UserProfile';
import AdminUserList from './components/AllUsers';
import UserSearch from './components/searchUserByEmail';
import UserWallet from './components/wallet';
import GlobalCreditWatcher from './components/creditPractice';
import AffiliateGallery from './components/AffiliatMarket';
import AdminAffiliateAds from './components/AdminAffileateEdit.jsx';
import Banned from './components/Banned';
import VerifyOtp from './pages/VerifyOtp';
import WithdrawalAdmin from './components/AdminWithdrawalPage.jsx';
import WithdrawalForm from './components/Withdrawal.jsx';
import Loader from './components/Loader.jsx';
import Chat from './components/chatme.jsx';
import TokenDisplay from './components/Test.jsx';
import AdSignUp from './pages/AdSignUp.jsx';
import AdSignIn from './pages/Adsignin.jsx';
import MaintenancePage from './pages/maintenance.jsx';

/* empty stubs – replace later */
const Empty = () => <div />;

export default function App() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  /**
   * MAINTENANCE SWITCH
   * Set this to 'true' to enable the maintenance screen.
   * Set this to 'false' for production mode.
   */
  const isMaintenanceMode = true; 

  useEffect(() => {
    // Only run loading logic if NOT in maintenance mode
    if (!isMaintenanceMode) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [location, isMaintenanceMode]);

  // --- RENDER MAINTENANCE PAGE ---
  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }

  // --- RENDER FULL APPLICATION ---
  return (
    <>
      {loading && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.6)',
            zIndex: 9999,
          }}
        >
          <Loader />
        </div>
      )}

      <GlobalCreditWatcher />
      
      <Routes>
        {/* -------- PUBLIC -------- */}
        <Route element={<PublicLayout />}>
          <Route index element={<Landing />} />
          <Route
            path="signin"
            element={
              <GuestRoute>
                <SignIn />
              </GuestRoute>
            }
          />
          <Route
            path="Adsignin"
            element={
              <GuestRoute>
                <AdSignIn />
              </GuestRoute>
            }
          />
          <Route
            path="signup"
            element={
              <GuestRoute>
                <SignUp />
              </GuestRoute>
            }
          />
          <Route
            path="Adsignup"
            element={
              <GuestRoute>
                <AdSignUp />
              </GuestRoute>
            }
          />
          <Route
            path="verify-otp"
            element={
              <GuestRoute>
                <VerifyOtp />
              </GuestRoute>
            }
          />
        </Route>

        {/* -------- DASHBOARD (auth‑only) -------- */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={['admin', 'advertiser', 'user']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Empty />} />
          <Route path="upload" element={<ProtectedRoute><UploadAd /></ProtectedRoute>} />
          <Route path="wallet" element={<ProtectedRoute><UserWallet /></ProtectedRoute>} />
          <Route path="chatme" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="my-ads" element={<ProtectedRoute><AdvertiserDashboard /></ProtectedRoute>} />
          <Route path="watch" element={<ProtectedRoute><WatchAd /></ProtectedRoute>} />
          <Route path="history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="Affiliate" element={<ProtectedRoute><AffiliateGallery /></ProtectedRoute>} />
          <Route path="withdrawa" element={<ProtectedRoute><WithdrawalForm /></ProtectedRoute>} />
          <Route path="account" element={<Empty />} />
          <Route path="contact" element={<ProtectedRoute><ContactForm /></ProtectedRoute>} />
          <Route path="test" element={<ProtectedRoute><TokenDisplay /></ProtectedRoute>} />
        </Route>

        {/* -------- USER PROFILE & ADMIN -------- */}
        <Route path='/edit-profile' element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path='/dashboard/users/search' element={<ProtectedRoute><UserSearch /></ProtectedRoute>} />
        <Route path="/dashboard/users/AllUsers" element={<ProtectedRoute><AdminUserList /></ProtectedRoute>} />
        <Route path='/dashboard/withdrawal' element={<ProtectedRoute><WithdrawalAdmin /></ProtectedRoute>} />
        <Route path="/dashboard/AffiliateAds" element={<ProtectedRoute><AdminAffiliateAds /></ProtectedRoute>} />

        {/* -------- FALLBACKS -------- */}
        <Route path="/banned" element={<Banned />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}