import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { login } from '../store/authSlice';
import { useSelector } from 'react-redux';
import GoogleSignInButton from '../components/GoogleSignInButton';
import ForgotPasswordModal from '../components/ForgotPasswordModal';

export default function SignIn() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'user'
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);

  const [showForgot, setShowForgot] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(login(form)).unwrap();
      if (result?.ban?.isBanned) {
        navigate('/banned');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-50 pt-20">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold">Welcome back</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600"
          />

          {/* 🔹 Forgot password link */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-indigo-600 hover:underline"
              onClick={() => setShowForgot(true)}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {status === 'loading' ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        {form.role === 'user' && (
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>
        )}

        {/* Google Sign In */}
        {form.role === 'user' && (
          <GoogleSignInButton text="Sign in with Google" />
        )}

        {error && <p className="mt-4 text-center text-red-600">{error}</p>}

        <p className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>

      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
    </section>
  );
}
