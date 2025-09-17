import { useSelector } from 'react-redux';
import { UserCircle, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchUserCount } from '../api/userApi'; // 👈 Import API

export default function AuthNavbar({ setSidebarOpen }) {
  const user = useSelector((s) => s.auth.user);
  const navigate = useNavigate();
  const [totalUsers, setTotalUsers] = useState(null);

  useEffect(() => {
    const getUserCount = async () => {
      try {
        const count = await fetchUserCount();
        setTotalUsers(count);
      } catch (err) {
        console.error('Failed to fetch total users', err);
      }
    };
    getUserCount();
  }, []);

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6 shadow-sm relative">
      {/* Hamburger for Mobile */}
      <div className="md:hidden">
        <button
          className="p-2 rounded-lg border border-gray-200 shadow hover:bg-gray-100 transition"
          onClick={() => setSidebarOpen(prev => !prev)}
        >
          <Menu className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      {/* 👇 Total Users in the middle */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <div className="bg-white border shadow-md rounded-lg px-4 py-1 text-center w-32">
          <h3 className="text-gray-600 text-xs font-medium">Total Users</h3>
          <p className="text-base font-bold text-indigo-600">
            {totalUsers !== null ? totalUsers : '...'}
          </p>
        </div>
      </div>

      {/* Greeting Section */}
      <div className="flex items-center gap-3">
        <div className="text-sm sm:text-base md:text-lg font-semibold text-gray-700">
          Hi,&nbsp;
          <span className="text-indigo-600 font-bold">{user?.name || 'User'}</span>
        </div>
      </div>

      {/* Logo + Profile */}
      <div className="flex items-center gap-5">
        <h1
          className="text-xl sm:text-2xl font-extrabold text-indigo-500 tracking-wide cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => navigate('/')}
        >
          Advestore
        </h1>

        <UserCircle
          className="h-9 w-9 text-indigo-400 cursor-pointer transition-colors duration-300 hover:text-indigo-600"
          onClick={() => navigate('/profile')}
        />
      </div>
    </header>
  );
}
